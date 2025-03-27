import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { LoginDTO } from '../auth/dto/login.dto';
import { UserRole } from 'src/common/role.enum';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    // Transformer le DTO en entité
    const user = await this.userRepository.save(plainToInstance(User, createUserDto));
    // @ts-ignore
    delete user.password;
    console.log(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserByEmail(data: LoginDTO): Promise<User|null> {
    if (!data.email) {
      throw new NotFoundException('Email non fourni.');
    }

    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new NotFoundException(`Aucun utilisateur trouvé avec l'email ${data.email}.`);
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
}