import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1757121401630 implements MigrationInterface {

    TABLE_NAME = 'users';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: this.TABLE_NAME,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                },
                {
                    name: "username",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "password",
                    type: "varchar",
                    length: "255",
                    isNullable: false,
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()",
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()",
                },
            ]
        });

        await queryRunner.createTable(table, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.TABLE_NAME);
    }

}
