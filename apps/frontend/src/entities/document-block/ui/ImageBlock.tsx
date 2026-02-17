import { useState, useRef, ChangeEvent } from 'react';
import { DocumentBlock } from '@shared/types/document.types';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useUploadFileMutation } from '@shared/api/documentFilesApi';

interface ImageBlockProps {
  block: DocumentBlock;
  onUpdate: (blockId: string, content: any) => void;
  onDelete: (blockId: string) => void;
  onCreate: (blockId: string) => void;
  onIndent?: (blockId: string) => void;
  onOutdent?: (blockId: string) => void;
  onFocus?: () => void;
}

export const ImageBlock = ({ block, onUpdate, onDelete, onCreate, onFocus }: ImageBlockProps) => {
  const [caption, setCaption] = useState(block.content?.caption || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile] = useUploadFileMutation();

  const imageUrl = block.content?.url;
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

      // Construct image URL from file path
      const imageUrl = `${import.meta.env.VITE_API_URL}/files/${result.file_id}`;
      
      onUpdate(block.block_id, {
        url: imageUrl,
        caption: caption,
        width: block.content?.width,
        height: block.content?.height,
        file_id: result.file_id,
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCaptionChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newCaption = e.currentTarget.textContent || '';
    setCaption(newCaption);
    onUpdate(block.block_id, {
      ...block.content,
      caption: newCaption,
    });
  };

  const handleRemove = () => {
    onDelete(block.block_id);
  };

  if (!imageUrl) {
    return (
      <div className="relative group border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
              <span>Click to upload image</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative">
        <img
          src={imageUrl}
          alt={caption || 'Image'}
          className="w-full rounded-lg"
          style={{
            maxWidth: block.content?.width || '100%',
            maxHeight: block.content?.height || 'auto',
          }}
        />
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {caption !== undefined && (
        <div
          contentEditable
          onInput={handleCaptionChange}
          className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center outline-none"
          suppressContentEditableWarning
          data-placeholder="Add a caption..."
        >
          {caption}
        </div>
      )}
    </div>
  );
};
