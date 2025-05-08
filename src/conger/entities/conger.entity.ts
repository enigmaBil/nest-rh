/* eslint-disable prettier/prettier */
// src/conger/entities/conger.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { StatutConge } from './status.enum';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class Conger extends BaseEntity {
  @Column()
  nom: string;

  @Column()
  dateDebut: string;

  @Column()
  dateFin: string;

  @Column()
  type: string;

  @Column({
    type: 'enum',
    enum: StatutConge,
    default: StatutConge.EN_ATTENTE,
  })
  statut: StatutConge;

  @ManyToOne(() => User, user => user.conges, { eager: true }) // Ajout de eager loading pour accéder directement à l'email
  @JoinColumn({ name: 'userId' })
  user: User;
}
