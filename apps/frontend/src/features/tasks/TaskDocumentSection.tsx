import { Button } from '@ui/button';
import { FileText, Plus, ExternalLink } from 'lucide-react';
import { useCreateDocumentMutation } from '@shared/api/documentsApi';
import { useNavigate } from 'react-router-dom';

interface TaskDocumentSectionProps {
  taskId: string;
  projectId: string;
  documentId?: string;
  taskName: string;
}

export const TaskDocumentSection = ({ taskId, projectId, documentId, taskName }: TaskDocumentSectionProps) => {
  const navigate = useNavigate();
  const [createDocument] = useCreateDocumentMutation();

  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument({
        projectId,
        title: `Document for task: ${taskName}`,
        icon: '📄',
      }).unwrap();

      // Navigate to the new document
      navigate(`/projects/${projectId}/documents/${newDoc.document_id}`);
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  const handleOpenDocument = () => {
    if (documentId) {
      navigate(`/projects/${projectId}/documents/${documentId}`);
    }
  };

  if (!documentId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
        <FileText className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No document attached
        </h3>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Create a document for this task to organize detailed information, notes, and specifications
        </p>
        <Button onClick={handleCreateDocument}>
          <Plus className="w-4 h-4 mr-2" />
          Create Document
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 border border-gray-300 dark:border-gray-700 rounded-lg">
      <FileText className="w-12 h-12 text-blue-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Document attached
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        This task has an associated document with detailed information
      </p>
      <Button onClick={handleOpenDocument}>
        <ExternalLink className="w-4 h-4 mr-2" />
        Open Document
      </Button>
    </div>
  );
};
