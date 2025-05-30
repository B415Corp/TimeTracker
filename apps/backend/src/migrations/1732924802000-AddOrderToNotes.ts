import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderToNotes1732924802000 implements MigrationInterface {
    name = 'AddOrderToNotes1732924802000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notes" ADD COLUMN "order" integer NOT NULL DEFAULT 0;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notes" DROP COLUMN "order";
        `);
    }
} 