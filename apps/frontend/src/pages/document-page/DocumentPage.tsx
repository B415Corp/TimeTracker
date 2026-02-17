import { useParams } from 'react-router-dom';
import { useGetDocumentQuery, useUpdateDocumentMutation } from '@shared/api/documentsApi';
import { DocumentEditor } from '@features/document-editor/DocumentEditor';
import { Input } from '@ui/input';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const DocumentPage = () => {
  const { documentId, projectId } = useParams<{ documentId: string; projectId: string }>();
  const { data: document, isLoading } = useGetDocumentQuery(documentId!);
  const [updateDocument] = useUpdateDocumentMutation();
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (document) {
      setTitle(document.title);
    }
  }, [document]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Debounced update
    const timeout = setTimeout(() => {
      if (documentId) {
        updateDocument({ documentId, title: newTitle });
      }
    }, 500);

    return () => clearTimeout(timeout);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading document...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Document not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center gap-4">
          <Link
            to={`/projects/${projectId}/documents`}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Input
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="text-4xl font-bold border-none focus:ring-0 px-0"
          />
        </div>
      </div>

      <DocumentEditor documentId={documentId!} />
    </div>
  );
};
