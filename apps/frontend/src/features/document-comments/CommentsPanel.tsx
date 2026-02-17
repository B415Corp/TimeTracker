import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@ui/button';
import { Textarea } from '@ui/textarea';
import { Avatar, AvatarFallback } from '@ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  comment_id: string;
  block_id?: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    user_id: string;
    name: string;
    email: string;
  };
}

interface CommentsPanelProps {
  documentId: string;
  blockId?: string;
  comments: Comment[];
  currentUserId: string;
  onAddComment: (content: string, blockId?: string) => void;
  onUpdateComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentsPanel = ({
  documentId,
  blockId,
  comments,
  currentUserId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: CommentsPanelProps) => {
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter comments by blockId if provided
  const filteredComments = blockId
    ? comments.filter((c) => c.block_id === blockId)
    : comments;

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim(), blockId);
      setNewComment('');
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.comment_id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (commentId: string) => {
    if (editContent.trim()) {
      onUpdateComment(commentId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Comments
            {filteredComments.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({filteredComments.length})
              </span>
            )}
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No comments yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Be the first to comment
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div key={comment.comment_id} className="group">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {comment.user?.name || 'Unknown User'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    {comment.user_id === currentUserId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(comment)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteComment(comment.comment_id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {editingId === comment.comment_id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="text-sm min-h-[60px]"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(comment.comment_id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Comment Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={blockId ? "Comment on this block..." : "Add a comment..."}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Cmd/Ctrl + Enter to submit
            </p>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!newComment.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
