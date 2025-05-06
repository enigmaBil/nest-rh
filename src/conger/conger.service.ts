import { Injectable } from '@nestjs/common';
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
    const dtoWithDefault = {
      ...createCongerDto,
      statut: createCongerDto.statut ?? StatutConge.EN_ATTENTE,
    };
    const conger = this.congerRepository.create(dtoWithDefault);
    return this.congerRepository.save(conger);
  }

  async findAll(): Promise<Conger[]> {
    return this.congerRepository.find();
  }

  async updateStatut(id: number, statut: StatutConge): Promise<Conger> {
    const conger = await this.congerRepository.findOne({ where: { id } });
    if (!conger) throw new Error('Congé introuvable');

    // Mettre à jour le statut du congé
    conger.statut = statut;
    const updatedConger = await this.congerRepository.save(conger);

    // Envoi de l'email de notification au demandeur
    await this.mailService.sendLeaveValidationEmail(
      conger.nom,
      conger.nom,
      statut === StatutConge.ACCEPTE ? 'ACCEPTE' : 'REFUSE',
    );

    return updatedConger;
  }

  async remove(id: number): Promise<void> {
    await this.congerRepository.delete(id);
  }
}
