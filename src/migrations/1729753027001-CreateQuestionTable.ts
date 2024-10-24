import { TABLES } from "src/constants/tables";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateQuestionTable1729753027001 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: TABLES.QUESTION,
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    length: "100",
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                },
                {
                    name: "question",
                    type: "varchar",
                    length: "100"
                },
                {
                    name: "options",
                    type: "longtext",
                },
                {
                    name: "answer",
                    type: "varchar",
                    length: "100",
                },
                {
                    name: "score",
                    type: "int",
                    length: "10",
                },
                {
                    name: "duration",
                    type: "int",
                    length: "10",
                },
                {
                    name: "game_id",
                    type: "varchar",
                    length: "100",
                },
                {
                    name: 'created_at',
                    type: 'datetime',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'datetime',
                    default: 'now()',
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(TABLES.QUESTION);
    }

}
