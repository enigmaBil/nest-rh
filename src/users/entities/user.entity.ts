/* eslint-disable prettier/prettier */
// src/users/entities/user.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Conger } from 'src/conger/entities/conger.entity';
import { BaseEntity } from 'src/common/base.entity';
import { UserRole } from 'src/common/role.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 191 })
  @ApiProperty()
  name: string;

  @Column({ type: 'varchar', unique: true })
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @ApiProperty()
  role: UserRole;

  @OneToMany(() => Conger, conger => conger.user)
  conges: Conger[];
}
