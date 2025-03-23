import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  poste: string;

  @Column({ type: 'date' })
  dateEmbauche: string;
}
