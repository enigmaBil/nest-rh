/* eslint-disable prettier/prettier */
<<<<<<< HEAD
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
=======
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
>>>>>>> 91fd208 (version final)
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conger } from './entities/conger.entity';
import { CreateCongerDto } from './dto/create-conger.dto';
import { StatutConge } from './entities/status.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CongerService {
  private readonly logger = new Logger(CongerService.name);

  constructor(
    @InjectRepository(Conger)
    private readonly congerRepository: Repository<Conger>,
    private readonly mailService: MailService,
  ) {}

  async create(createCongerDto: CreateCongerDto): Promise<Conger> {
    const { userId, ...rest } = createCongerDto;

    const conger = this.congerRepository.create({
      ...rest,
      statut: rest.statut ?? StatutConge.EN_ATTENTE,
      user: { id: userId } as any,  // Création relation par ID
    });

    return this.congerRepository.save(conger);
  }

  async findAll(): Promise<Conger[]> {
    return this.congerRepository.find();
  }

  async updateStatut(id: number, statut: StatutConge): Promise<Conger> {
<<<<<<< HEAD
    const conger = await this.congerRepository.findOne({
      where: { id },
      relations: ['user'], // ✅ Charge la relation User
    });

    if (!conger) {
      throw new NotFoundException(`Congé introuvable pour l'ID ${id}`);

    }

    if (!Object.values(StatutConge).includes(statut)) {
      throw new BadRequestException('Statut non valide');
    }
=======
    const conger = await this.congerRepository.findOne({ where: { id } });
    if (!conger) throw new NotFoundException(`Congé avec ID ${id} introuvable`);
>>>>>>> 91fd208 (version final)

    conger.statut = statut;
    const updatedConger = this.congerRepository.create(conger);

<<<<<<< HEAD
=======
    try {
      await this.mailService.sendLeaveValidationEmail(
        conger.email,
        conger.nom,
        statut === StatutConge.ACCEPTE ? 'ACCEPTE' : 'REFUSE',
      );
      this.logger.log(`Email envoyé à ${conger.email} concernant le statut ${statut}`);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.logger.error(`Erreur lors de l'envoi de l'email : ${e.message}`);
      } else {
        this.logger.error('Erreur lors de l\'envoi de l\'email : Une erreur inconnue est survenue');
      }
    }
>>>>>>> 91fd208 (version final)

    // ✅ Vérifie si conger.user est bien défini
    if (conger.user?.email && conger.user?.name) {
      console.log(`Email envoyé à ${conger.user.email} avec le statut ${statut}`);
      await this.mailService.sendLeaveValidationEmail(
        conger.user.name,
        conger.user.email,
        statut === StatutConge.ACCEPTE ? 'ACCEPTE' : 'REFUSE',

      );

    }
    return await this.congerRepository.save(updatedConger);

  }

<<<<<<< HEAD

=======
  // ✅ Corrigé ici DANS la classe CongerService et NON dehors
>>>>>>> 91fd208 (version final)
  async remove(id: number): Promise<void> {
    const result = await this.congerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Congé avec ID ${id} introuvable`);
    }
  }
}
