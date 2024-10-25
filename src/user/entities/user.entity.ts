import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { TABLES } from "src/constants/tables";
import { USER_STATUSES } from "src/constants/statuses/user";

@Entity(TABLES.USER)
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Column()
    fullname: string;

    @Column({ default: USER_STATUSES.ACTIVE })
    status: string;

    @Column({ default: "" })
    created_at: string;

    @Column({ default: "" })
    updated_at: string;

    @Column({ default: "" })
    last_login: string;

}