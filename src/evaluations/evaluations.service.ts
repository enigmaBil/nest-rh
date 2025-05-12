import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepo: Repository<Evaluation>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ➕ Créer une évaluation
  async create(dto: CreateEvaluationDto): Promise<Evaluation> {
    const employe = await this.userRepo.findOne({ where: { id: dto.employeId } });
    if (!employe) {
      throw new NotFoundException('Employé non trouvé');
    }

    const evaluation = this.evaluationRepo.create({
      score: dto.score,
      commentaire: dto.commentaire,
      dateEvaluation: new Date(dto.dateEvaluation),
      employe,
    });

    return await this.evaluationRepo.save(evaluation);
  }

  // 📋 Récupérer toutes les évaluations
  async findAll(): Promise<Evaluation[]> {
    return await this.evaluationRepo.find({ relations: ['employe'] });
  }

  // 🔍 Récupérer une évaluation par ID
  async findOne(id: number): Promise<Evaluation> {
    const evaluation = await this.evaluationRepo.findOne({
      where: { id },
      relations: ['employe'],
    });

    if (!evaluation) {
      throw new NotFoundException('Évaluation non trouvée');
    }

    return evaluation;
  }

  // ✏️ Mettre à jour une évaluation
  async update(id: number, dto: UpdateEvaluationDto): Promise<Evaluation> {
    const evaluation = await this.findOne(id);
    Object.assign(evaluation, dto);
    return await this.evaluationRepo.save(evaluation);
  }

  // 🗑️ Supprimer une évaluation
  async remove(id: number): Promise<void> {
    const result = await this.evaluationRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Évaluation non trouvée');
    }
  }

  // 📂 Récupérer toutes les évaluations d’un employé
  async findByEmployeeId(employeeId: number): Promise<Evaluation[]> {
    const employe = await this.userRepo.findOne({ where: { id: employeeId } });
    if (!employe) {
      throw new NotFoundException('Employé non trouvé');
    }

    return await this.evaluationRepo.find({
      where: { employe: { id: employeeId } },
      relations: ['employe'],
    });
  }
}
