/* eslint-disable prettier/prettier */

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Conger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  dateDebut: string;

  @Column()
  dateFin: string;

  @Column()
  type: string;

  @Column()
  statut: string; 
}
