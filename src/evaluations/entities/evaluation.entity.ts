/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Evaluation extends BaseEntity {
  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'text' })
  commentaire: string;

  @Column({ type: 'date' })
  dateEvaluation: Date;

  @ManyToOne(() => User, (user) => user.evaluations, { eager: true, onDelete: 'CASCADE' })
  employe: User;
}
