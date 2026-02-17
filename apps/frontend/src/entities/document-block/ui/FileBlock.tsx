import { useState, useRef, ChangeEvent } from 'react';
import { DocumentBlock } from '@shared/types/document.types';
import { Upload, File as FileIcon, Download, X } from 'lucide-react';
import { useUploadFileMutation, useDeleteFileMutation } from '@shared/api/documentFilesApi';

interface FileBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onFocus?: () => void;
}

export const FileBlock = ({ block, onUpdate, onDelete, onCreate, onFocus }: FileBlockProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile] = useUploadFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const fileId = block.content?.file_id;
  const filename = block.content?.filename;
  const fileSize = block.content?.size;
  const documentId = block.document_id;

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !documentId) return;

    setIsUploading(true);
    try {
      const result = await uploadFile({
        documentId,
        file,
        blockId: block.block_id,
      }).unwrap();

      onUpdate(block.block_id, {
        file_id: result.file_id,
        filename: result.filename,
        size: result.size,
        mime_type: result.mime_type,
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (fileId) {
      try {
        await deleteFile(fileId).unwrap();
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
    onDelete(block.block_id);
  };

  const handleDownload = () => {
    if (fileId) {
      window.open(`${import.meta.env.VITE_API_URL}/files/${fileId}`, '_blank');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!fileId) {
    return (
      <div className="relative group border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8" />
              <span>Click to upload file</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="relative group border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800">
      <FileIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
          {filename || 'Untitled file'}
        </div>
        {fileSize && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(fileSize)}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          title="Download"
        >
          <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};
