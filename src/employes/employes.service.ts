import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employe } from './entities/employe.entity';
import { CreateEmployeDto } from './dto/create-employe.dto';

@Injectable()
export class EmployesService {
  constructor(
    @InjectRepository(Employe)
    private employeRepository: Repository<Employe>,
  ) {}

  async create(createEmployeDto: CreateEmployeDto): Promise<Employe> {
    const employe = this.employeRepository.create(createEmployeDto);
    return this.employeRepository.save(employe);
  }

  async findAll(): Promise<Employe[]> {
    return this.employeRepository.find();
  }

  async findOne(id: number): Promise<Employe> {
    const employe = await this.employeRepository.findOneBy({ id });
    if (!employe) {
      throw new NotFoundException(`Employe with ID ${id} not found`);
    }
    return employe;
  }

  async update(id: number, createEmployeDto: CreateEmployeDto): Promise<Employe> {
    const employe = await this.findOne(id);
    Object.assign(employe, createEmployeDto);
    return this.employeRepository.save(employe);
  }

  async remove(id: number): Promise<void> {
    const employe = await this.findOne(id);
    await this.employeRepository.delete(employe.id);
  }
}
