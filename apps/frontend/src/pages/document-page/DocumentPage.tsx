import { useParams, Link } from 'react-router-dom';
import { useGetDocumentQuery, useUpdateDocumentMutation } from '@shared/api/documentsApi';
import { DocumentEditor } from '@features/document-editor/DocumentEditor';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const DocumentPage = () => {
  const { documentId, projectId } = useParams<{ documentId: string; projectId: string }>();
  const { data: document, isLoading } = useGetDocumentQuery(documentId!);
  const [updateDocument] = useUpdateDocumentMutation();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTitleChange = (e: React.FormEvent<HTMLHeadingElement>) => {
    const newTitle = e.currentTarget.textContent || '';

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (documentId) {
        updateDocument({ documentId, title: newTitle });
      }
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading document...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Document not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-8 pb-32">
        <div className="mb-6">
          <Link
            to={`/projects/${projectId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to project
          </Link>
        </div>

        <div className="px-8 py-8">
          <h1
            contentEditable
            onInput={handleTitleChange}
            suppressContentEditableWarning
            className="text-4xl font-bold mb-8 outline-none text-gray-900 dark:text-gray-100 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
            data-placeholder="Untitled"
          >
            {document.title}
          </h1>
          
          <DocumentEditor documentId={documentId!} />
        </div>
      </div>
    </div>
  );
};
