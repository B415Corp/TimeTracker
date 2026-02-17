import { useState, useEffect } from 'react';
import { useGetBlocksByDocumentQuery, useCreateBlockMutation, useUpdateBlockMutation, useDeleteBlockMutation } from '@shared/api/documentBlocksApi';
import { BlockRenderer } from '@entities/document-block/ui/BlockRenderer';
import { BlockType } from '@shared/types/document.types';
import { Button } from '@ui/button';
import { Plus } from 'lucide-react';

interface DocumentEditorProps {
  documentId: string;
}

export const DocumentEditor = ({ documentId }: DocumentEditorProps) => {
  const { data: blocks = [], isLoading } = useGetBlocksByDocumentQuery(documentId);
  const [createBlock] = useCreateBlockMutation();
  const [updateBlock] = useUpdateBlockMutation();
  const [deleteBlock] = useDeleteBlockMutation();

  const handleUpdateBlock = async (blockId: string, content: any) => {
    try {
      await updateBlock({ blockId, content }).unwrap();
    } catch (error) {
      console.error('Failed to update block:', error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      await deleteBlock(blockId).unwrap();
    } catch (error) {
      console.error('Failed to delete block:', error);
    }
  };

  const handleCreateBlock = async (afterBlockId?: string) => {
    try {
      const afterBlock = blocks.find((b) => b.block_id === afterBlockId);
      const newOrder = afterBlock ? afterBlock.order + 1 : blocks.length;

      await createBlock({
        documentId,
        type: BlockType.PARAGRAPH,
        content: { text: '' },
        order: newOrder,
      }).unwrap();
    } catch (error) {
      console.error('Failed to create block:', error);
    }
  };

  const handleAddBlock = () => {
    handleCreateBlock();
  };

  if (isLoading) {
    return <div className="p-8">Loading document...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="space-y-1">
        {blocks.map((block) => (
          <div key={block.block_id} className="relative group">
            <BlockRenderer
              block={block}
              onUpdate={handleUpdateBlock}
              onDelete={handleDeleteBlock}
              onCreate={handleCreateBlock}
            />
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">This document is empty</p>
            <Button onClick={handleAddBlock} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add first block
            </Button>
          </div>
        )}

        {blocks.length > 0 && (
          <button
            onClick={handleAddBlock}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Click to add block
          </button>
        )}
      </div>
    </div>
  );
};
