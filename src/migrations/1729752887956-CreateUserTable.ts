import { TABLES } from "src/constants/tables";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1729752887956 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: TABLES.USER,
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
                    name: "email",
                    type: "varchar",
                    length: "100"
                },
                {
                    name: "password",
                    type: "varchar",
                    length: "100",
                    default: null,
                    isNullable: true
                },
                {
                    name: "fullname",
                    type: "varchar",
                    length: "100",
                    isNullable: true
                },
                {
                    name: "status",
                    type: "varchar",
                    length: "20",
                    // default: Statuses.INACTIVE_STATUS
                },
                {
                    name: 'last_login',
                    type: 'datetime',
                    default: null,
                    isNullable: true
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
        await queryRunner.dropTable(TABLES.USER);
    }

}
