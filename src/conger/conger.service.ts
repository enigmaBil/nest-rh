/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conger } from './entities/conger.entity';
import { CreateCongerDto } from './dto/create-conger.dto';
import { StatutConge } from './entities/status.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CongerService {
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

    conger.statut = statut;
    const updatedConger = this.congerRepository.create(conger);


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


  async remove(id: number): Promise<void> {
    await this.congerRepository.delete(id);
  }
}
