/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conger } from './entities/conger.entity';
import { CreateCongerDto } from './dto/create-conger.dto';

@Injectable()
export class CongerService {
  constructor(
    @InjectRepository(Conger)
    private readonly congerRepository: Repository<Conger>,
  ) {}

  // Ajouter 
  async create(createCongerDto: CreateCongerDto): Promise<Conger> {
    const conger = this.congerRepository.create(createCongerDto);
    return this.congerRepository.save(conger);
  }

  // Afficher 
  async findAll(): Promise<Conger[]> {
    return this.congerRepository.find();
  }

  // Modifier 
  async update(id: number, updateCongerDto: CreateCongerDto): Promise<Conger> {
   
    const conger = await this.congerRepository.findOne({ where: { id } });
    
    if (!conger) {
      throw new Error('Conger not found');
    }

    // Modifier
    Object.assign(conger, updateCongerDto);
    return this.congerRepository.save(conger);
  }

  // Supprimer 
  async remove(id: number): Promise<void> {
    await this.congerRepository.delete(id);
  }
}
