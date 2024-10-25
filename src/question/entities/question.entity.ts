import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TABLES } from "src/constants/tables";

@Entity(TABLES.QUESTION)
export class Question {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    question: string;

    @Column()
    options: string;

    @Column()
    answer: number;

    @Column()
    score: number;

    @Column()
    duration: number;

    @Column()
    order: number;

    @Column()
    game_id: string;

    @Column({ default: "" })
    created_at: string;

    @Column({ default: "" })
    updated_at: string;
}