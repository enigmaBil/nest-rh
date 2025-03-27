import { BaseEntity } from "src/common/base.entity";
import { UserRole } from "src/common/role.enum";
import { Column, Entity, Table } from "typeorm";
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
    @Column(
        {
            type: 'varchar',
            length: 191
        }
    )
    name: string;
    @Column(
        {
            type: 'varchar',
            unique: true,
        }
    )
    email: string;
    @Column()
    password: string;
    @Column(
       { 
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    }
    )
    role: UserRole;

    
    
}
