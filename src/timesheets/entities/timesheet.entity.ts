import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from "../../common/base.entity";
import { TimesheetStatusEnum } from '../../common/timesheet-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Timesheet extends BaseEntity{
  @ManyToOne(() => User, (user) => user.timesheets, { onDelete: 'CASCADE' })
  employee: User; // Employé associé

  @Column({ type: 'date' })
  date: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column('float')
  totalHours: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TimesheetStatusEnum, default: TimesheetStatusEnum.PENDING })
  status: TimesheetStatusEnum;

  @Column({ nullable: true })
  comment: string;
}
