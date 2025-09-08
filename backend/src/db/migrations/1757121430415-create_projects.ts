import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProjects1757121430415 implements MigrationInterface {

    TABLE_NAME = 'projects';

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
                    name: "title",
                    type: "varchar",
                    length: "100",
                    isNullable: false,
                },
                {
                    name: "summary",
                    type: "text",
                    isNullable: false,
                },
                {
                    name: "content",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "image_thumb",
                    type: "varchar",
                    length: "255",
                    isNullable: true,
                },
                {
                    name: "author",
                    type: "varchar",
                    length: "100",
                    isNullable: true,
                },
                {
                    name: "is_featured",
                    type: "boolean",
                    default: false,
                },
                {
                    name: "published_at",
                    type: "timestamp",
                    isNullable: true,
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
