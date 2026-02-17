import { useState } from 'react';
import { useGetDocumentHierarchyQuery, useUpdateDocumentMutation } from '@shared/api/documentsApi';
import { Document } from '@shared/types/document.types';
import { ChevronRight, ChevronDown, FileText, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';

interface DocumentTreeWidgetProps {
  projectId: string;
  currentDocumentId?: string;
}

interface TreeNodeProps {
  doc: Document;
  level: number;
  projectId: string;
  currentDocumentId?: string;
  onCreateChild: (parentId: string) => void;
}

const TreeNode = ({ doc, level, projectId, currentDocumentId, onCreateChild }: TreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = doc.children && doc.children.length > 0;
  const isActive = doc.document_id === currentDocumentId;

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group ${
          isActive ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
        style={{ marginLeft: `${level * 16}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {isOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
        
        <Link
          to={`/projects/${projectId}/documents/${doc.document_id}`}
          className="flex-1 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 truncate"
        >
          {doc.title || 'Untitled'}
        </Link>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={() => onCreateChild(doc.document_id)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Add sub-document"
          >
            <Plus className="w-3 h-3 text-gray-500" />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                <MoreHorizontal className="w-3 h-3 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Move to...</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {hasChildren && isOpen && (
        <div>
          {doc.children!.map((child) => (
            <TreeNode
              key={child.document_id}
              doc={child}
              level={level + 1}
              projectId={projectId}
              currentDocumentId={currentDocumentId}
              onCreateChild={onCreateChild}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const DocumentTreeWidget = ({ projectId, currentDocumentId }: DocumentTreeWidgetProps) => {
  const { data: hierarchy = [], isLoading } = useGetDocumentHierarchyQuery(projectId);
  const navigate = useNavigate();

  const handleCreateChild = (parentId: string) => {
    // TODO: Implement create child document
    console.log('Create child of', parentId);
  };

  if (isLoading) {
    return <div className="p-4 text-sm text-gray-500">Loading...</div>;
  }

  if (hierarchy.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500 mb-2">No documents yet</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="mb-2 px-2">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Documents
        </h3>
      </div>
      
      <div className="space-y-0.5">
        {hierarchy.map((doc) => (
          <TreeNode
            key={doc.document_id}
            doc={doc}
            level={0}
            projectId={projectId}
            currentDocumentId={currentDocumentId}
            onCreateChild={handleCreateChild}
          />
        ))}
      </div>
    </div>
  );
};
