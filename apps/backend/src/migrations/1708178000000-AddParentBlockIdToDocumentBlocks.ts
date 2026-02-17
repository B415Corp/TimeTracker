import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddParentBlockIdToDocumentBlocks1708178000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if column exists first
    const table = await queryRunner.getTable('document_blocks');
    const hasColumn = table?.findColumnByName('parent_block_id');

    if (!hasColumn) {
      // Add parent_block_id column
      await queryRunner.addColumn(
        'document_blocks',
        new TableColumn({
          name: 'parent_block_id',
          type: 'uuid',
          isNullable: true,
        }),
      );

      // Add foreign key
      await queryRunner.createForeignKey(
        'document_blocks',
        new TableForeignKey({
          columnNames: ['parent_block_id'],
          referencedTableName: 'document_blocks',
          referencedColumnNames: ['block_id'],
          onDelete: 'CASCADE',
        }),
      );

      // Add index for better query performance
      await queryRunner.query(`
        CREATE INDEX "idx_document_blocks_parent_block_id" ON "document_blocks" ("parent_block_id");
      `);

      // Add index for order + parent
      await queryRunner.query(`
        CREATE INDEX "idx_document_blocks_parent_order" ON "document_blocks" ("parent_block_id", "order");
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_document_blocks_parent_order";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_document_blocks_parent_block_id";`);

    // Drop foreign key
    const table = await queryRunner.getTable('document_blocks');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('parent_block_id') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('document_blocks', foreignKey);
    }

    // Drop column
    await queryRunner.dropColumn('document_blocks', 'parent_block_id');
  }
}
