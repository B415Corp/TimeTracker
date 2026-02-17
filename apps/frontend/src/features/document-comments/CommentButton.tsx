import { MessageSquare } from 'lucide-react';
import { Button } from '@ui/button';

interface CommentButtonProps {
  blockId: string;
  commentCount: number;
  onClick: () => void;
}

export const CommentButton = ({ blockId, commentCount, onClick }: CommentButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <MessageSquare className="w-4 h-4" />
      {commentCount > 0 && (
        <span className="ml-1 text-xs">{commentCount}</span>
      )}
    </Button>
  );
};
