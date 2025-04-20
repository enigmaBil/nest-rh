import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { LoginDTO } from '../auth/dto/login.dto';
import { UserRole } from 'src/common/role.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.createAdminUser();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }
    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(12);
    const password = createUserDto.password;
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    // Transformer le DTO en entité
    const user = await this.userRepository.create(plainToInstance(User, createUserDto));

    // Générer un token pour le lien de réinitialisation
    const resetToken: string = await this.generateResetToken(user);

    // Envoi de l'email avec le lien de réinitialisation
    //await this.mailService.sendAccountCreationEmail(user.email ,user.name, resetToken);
    // Envoi des parametres de connexion
    await this.mailService.sendAccountCredentialsEmail(user.email, user.name, password);
    await this.userRepository.save(user);
    // @ts-ignore
    delete user.password;
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserByEmail(email: string): Promise<User|null> {
    if (!email) {
      throw new NotFoundException('Email non fourni.');
    }

    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'email ${email}.`);
    }
    return user;
  }

  async findOne(id: number): Promise<User> {
    return this.checkUserExists(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.checkUserExists(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.checkUserExists(id);
    await this.userRepository.remove(user);
  }

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException('Token invalide ou expiré', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Met à jour le mot de passe d'un utilisateur.
   */
  async updatePassword(user: User, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user); // Sauvegarde l'utilisateur mis à jour
  }

  private async checkUserExists(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`L'utilisateur avec l'ID ${id} n'existe pas.`);
    }
    return user;
  }

  private async createAdminUser() {
    console.log('creating admin user ...');
    const adminEmail = 'admin@rh.tn';
    const existingAdmin = await this.userRepository.findOneBy({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('password', 12);

      const adminUser = this.userRepository.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      await this.userRepository.save(adminUser);
      console.log('✅ Admin account created successfully!');
    } else {
      console.log('⚠️ Admin already exists. Skipping seeding.');
    }
  }

  // Générer un token JWT pour le lien de réinitialisation
  private async generateResetToken(user: User) {
    const payload = {email: user.email, sub: user.id};
    const token = this.jwtService.sign(payload, {expiresIn: '30m'});
    return token;
  }

}