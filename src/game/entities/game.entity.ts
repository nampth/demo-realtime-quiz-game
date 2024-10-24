import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer"; 
import { TABLES } from "src/constants/tables";
import { GAME_STATUSES } from "src/constants/statuses/game";

@Entity(TABLES.GAME)
export class Game {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ default: GAME_STATUSES.PENDING })
    status: string;

    @Column()
    created_by: string;

    @Column({ default: "" })
    created_at: string;

    @Column({ default: "" })
    updated_at: string;
}