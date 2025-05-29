import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNameFromNotes1732924801000 implements MigrationInterface {
    name = 'RemoveNameFromNotes1732924801000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notes" DROP COLUMN IF EXISTS "name"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notes" ADD COLUMN "name" character varying
        `);
    }
} 