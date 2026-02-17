import { useParams, Link } from 'react-router-dom';
import { useGetDocumentsByProjectQuery, useCreateDocumentMutation, useDeleteDocumentMutation } from '@shared/api/documentsApi';
import { Button } from '@ui/button';
import { Plus, FileText, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';

export const DocumentsListPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data: documents = [], isLoading } = useGetDocumentsByProjectQuery(projectId!);
  const [createDocument] = useCreateDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const handleCreateDocument = async () => {
    try {
      await createDocument({
        projectId: projectId!,
        title: 'Untitled',
      }).unwrap();
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(documentId).unwrap();
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading documents...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Documents</h1>
          <Button onClick={handleCreateDocument}>
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No documents yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first document</p>
            <Button onClick={handleCreateDocument}>
              <Plus className="w-4 h-4 mr-2" />
              Create Document
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <Link
                key={doc.document_id}
                to={`/projects/${projectId}/documents/${doc.document_id}`}
                className="block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {doc.icon && <span className="text-2xl">{doc.icon}</span>}
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{doc.title}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteDocument(doc.document_id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Updated {formatDate(doc.updated_at)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
