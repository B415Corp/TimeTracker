import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTextContentToJsonInNotes1734000000000 implements MigrationInterface {
    name = 'ChangeTextContentToJsonInNotes1734000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notes" ALTER COLUMN "text_content" TYPE json USING text_content::json;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notes" ALTER COLUMN "text_content" TYPE text USING text_content::text;
        `);
    }
} 