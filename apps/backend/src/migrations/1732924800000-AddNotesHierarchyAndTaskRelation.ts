import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotesHierarchyAndTaskRelation1732924800000 implements MigrationInterface {
    name = 'AddNotesHierarchyAndTaskRelation1732924800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notes" 
            ADD COLUMN "parent_note_id" uuid,
            ADD COLUMN "nesting_level" integer NOT NULL DEFAULT 0,
            ADD COLUMN "task_id" uuid
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_notes_parent_note_id" ON "notes" ("parent_note_id")
        `);

        await queryRunner.query(`
            ALTER TABLE "notes" 
            ADD CONSTRAINT "FK_notes_parent_note_id" 
            FOREIGN KEY ("parent_note_id") 
            REFERENCES "notes"("notes_id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "notes" 
            ADD CONSTRAINT "FK_notes_task_id" 
            FOREIGN KEY ("task_id") 
            REFERENCES "task"("task_id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "notes" 
            DROP CONSTRAINT "FK_notes_task_id"
        `);

        await queryRunner.query(`
            ALTER TABLE "notes" 
            DROP CONSTRAINT "FK_notes_parent_note_id"
        `);

        await queryRunner.query(`
            DROP INDEX "IDX_notes_parent_note_id"
        `);

        await queryRunner.query(`
            ALTER TABLE "notes" 
            DROP COLUMN "task_id",
            DROP COLUMN "nesting_level",
            DROP COLUMN "parent_note_id"
        `);
    }
} 