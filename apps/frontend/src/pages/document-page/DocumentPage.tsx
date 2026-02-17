import { useParams, Link } from 'react-router-dom';
import { useGetDocumentQuery, useUpdateDocumentMutation } from '@shared/api/documentsApi';
import { DocumentEditor } from '@features/document-editor/DocumentEditor';
import { CustomFieldsPanel } from '@features/custom-fields/CustomFieldsPanel';
import { PermissionsDialog } from '@features/document-permissions/PermissionsDialog';
import { CommentsPanel } from '@features/document-comments/CommentsPanel';
import {
  useGetDocumentMembersQuery,
  useAddDocumentMemberMutation,
  useUpdateDocumentMemberRoleMutation,
  useRemoveDocumentMemberMutation,
} from '@shared/api/documentMembersApi';
import {
  useGetDocumentCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from '@shared/api/commentsApi';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@ui/button';
import { DocumentRole } from '@shared/types/document.types';

export const DocumentPage = () => {
  const { documentId, projectId } = useParams<{ documentId: string; projectId: string }>();
  const { data: document, isLoading } = useGetDocumentQuery(documentId!);
  const [updateDocument] = useUpdateDocumentMutation();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const [showComments, setShowComments] = useState(false);

  // Members
  const { data: members = [] } = useGetDocumentMembersQuery(documentId!);
  const [addMember] = useAddDocumentMemberMutation();
  const [updateMemberRole] = useUpdateDocumentMemberRoleMutation();
  const [removeMember] = useRemoveDocumentMemberMutation();

  // Comments
  const { data: comments = [] } = useGetDocumentCommentsQuery(documentId!);
  const [addComment] = useAddCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

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

  const handleAddMember = async (userId: string, role: DocumentRole) => {
    try {
      await addMember({ documentId: documentId!, userId, role }).unwrap();
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleUpdateRole = async (userId: string, role: DocumentRole) => {
    try {
      const member = members.find((m) => m.user_id === userId);
      if (member) {
        await updateMemberRole({ documentId: documentId!, memberId: member.member_id, role }).unwrap();
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      const member = members.find((m) => m.user_id === userId);
      if (member) {
        await removeMember({ documentId: documentId!, memberId: member.member_id }).unwrap();
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleAddComment = async (content: string, blockId?: string) => {
    try {
      await addComment({ documentId: documentId!, content, blockId }).unwrap();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      await updateComment({ commentId, content }).unwrap();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId).unwrap();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            to={`/projects/${projectId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to project
          </Link>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Comments
              {comments.length > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {comments.length}
                </span>
              )}
            </Button>
            
            <PermissionsDialog
              documentId={documentId!}
              projectId={projectId!}
              currentMembers={members}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
              onUpdateRole={handleUpdateRole}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8 pb-32">
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
              
              <CustomFieldsPanel documentId={documentId!} projectId={projectId!} />
              
              <DocumentEditor documentId={documentId!} />
            </div>
          </div>
        </div>

        {showComments && (
          <div className="w-96 flex-shrink-0 h-full">
            <CommentsPanel
              documentId={documentId!}
              comments={comments}
              currentUserId={document.created_by}
              onAddComment={handleAddComment}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>
        )}
      </div>
    </div>
  );
};
