import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { StatutConge } from './status.enum';

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

  @Column({
    type: 'enum',
    enum: StatutConge,
    default: StatutConge.EN_ATTENTE,
  })
  statut: StatutConge;
}
