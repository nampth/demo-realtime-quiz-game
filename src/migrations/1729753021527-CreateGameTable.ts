
import { GAME_STATUSES } from "src/constants/statuses/game";
import { TABLES } from "src/constants/tables";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateGameTable1729753021527 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: TABLES.GAME,
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
                    name: "name",
                    type: "varchar",
                    length: "100"
                },

                {
                    name: "description",
                    type: "text",
                    isNullable: true
                },
                {
                    name: "status",
                    type: "varchar",
                    length: "20",
                    default: `"${GAME_STATUSES.PENDING}"`
                },
                {
                    name: "created_by",
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
        await queryRunner.dropTable(TABLES.GAME);
    }

}
