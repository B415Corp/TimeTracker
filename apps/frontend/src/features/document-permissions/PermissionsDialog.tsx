import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/dialog';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';
import { Avatar, AvatarFallback } from '@ui/avatar';
import { Users, X, Mail, Plus } from 'lucide-react';
import { useGetProjectByIdQuery } from '@shared/api/projects.service';
import { DocumentRole } from '@shared/types/document.types';

interface PermissionsDialogProps {
  documentId: string;
  projectId: string;
  currentMembers: any[];
  onAddMember: (userId: string, role: DocumentRole) => void;
  onRemoveMember: (userId: string) => void;
  onUpdateRole: (userId: string, role: DocumentRole) => void;
}

export const PermissionsDialog = ({
  documentId,
  projectId,
  currentMembers,
  onAddMember,
  onRemoveMember,
  onUpdateRole,
}: PermissionsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<DocumentRole>(DocumentRole.VIEWER);
  
  const { data: project } = useGetProjectByIdQuery({ id: projectId });
  const projectMembers = project?.members || [];

  // Filter out users already in document
  const availableUsers = projectMembers.filter(
    (pm: any) => !currentMembers.some((dm) => dm.user_id === pm.user.user_id)
  );

  const handleAdd = () => {
    if (selectedUserId) {
      onAddMember(selectedUserId, selectedRole);
      setSelectedUserId('');
      setSelectedRole(DocumentRole.VIEWER);
    }
  };

  const getRoleLabel = (role: DocumentRole) => {
    switch (role) {
      case DocumentRole.OWNER:
        return 'Owner';
      case DocumentRole.EDITOR:
        return 'Editor';
      case DocumentRole.VIEWER:
        return 'Viewer';
      default:
        return 'Unknown';
    }
  };

  const getRoleDescription = (role: DocumentRole) => {
    switch (role) {
      case DocumentRole.OWNER:
        return 'Full access, can manage permissions';
      case DocumentRole.EDITOR:
        return 'Can edit content';
      case DocumentRole.VIEWER:
        return 'Can view only';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Invite people to collaborate on this document
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Add Member Section */}
          <div className="flex gap-2">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select user..." />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((member: any) => (
                  <SelectItem key={member.user.user_id} value={member.user.user_id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {member.user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{member.user.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={(val) => setSelectedRole(val as DocumentRole)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DocumentRole.VIEWER}>Viewer</SelectItem>
                <SelectItem value={DocumentRole.EDITOR}>Editor</SelectItem>
                <SelectItem value={DocumentRole.OWNER}>Owner</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleAdd} disabled={!selectedUserId}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Current Members List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              People with access
            </h4>
            
            {currentMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No members yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentMembers.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {member.user?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {getRoleDescription(member.role)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(val) => onUpdateRole(member.user_id, val as DocumentRole)}
                        disabled={member.role === DocumentRole.OWNER}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DocumentRole.VIEWER}>Viewer</SelectItem>
                          <SelectItem value={DocumentRole.EDITOR}>Editor</SelectItem>
                          <SelectItem value={DocumentRole.OWNER}>Owner</SelectItem>
                        </SelectContent>
                      </Select>

                      {member.role !== DocumentRole.OWNER && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveMember(member.user_id)}
                        >
                          <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Invite by Email (placeholder) */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Invite by email
            </h4>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@example.com"
                className="flex-1"
                disabled
              />
              <Button variant="outline" disabled>
                <Mail className="w-4 h-4 mr-2" />
                Invite
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Coming soon
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
