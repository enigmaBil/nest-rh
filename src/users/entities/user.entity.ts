import { BaseEntity } from "src/common/base.entity";
import { UserRole } from "src/common/role.enum";
import { Column, Entity, OneToMany, Table } from "typeorm";
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Timesheet } from "src/timesheets/entities/timesheet.entity";

@Entity()
export class User extends BaseEntity {
    @Column(
        {
            type: 'varchar',
            length: 191
        }
    )
    @ApiProperty()
    name: string;
    @Column(
        {
            type: 'varchar',
            unique: true,
        }
    )
    @ApiProperty()
    email: string;
    @Column()
    @ApiProperty()
    password: string;
    @Column(
       { 
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    }
    )
    @ApiProperty()
    role: UserRole; 

    @OneToMany(() => User, (user) => user.timesheets, { nullable: true })
    @Exclude({ toPlainOnly: true })
    @ApiProperty({ type: () => User, isArray: true })
    timesheets: Timesheet[]; // Liste des feuilles de temps associées à l'utilisateur
}
