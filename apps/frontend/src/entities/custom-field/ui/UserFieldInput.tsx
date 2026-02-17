import { CustomField, DocumentFieldValue } from '@shared/types/document.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';
import { useGetProjectByIdQuery } from '@shared/api/projects.service';
import { Avatar, AvatarFallback } from '@ui/avatar';

interface UserFieldInputProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onChange: (value: any) => void;
}

export const UserFieldInput = ({ field, value, onChange }: UserFieldInputProps) => {
  const projectId = field.project_id;
  const { data: project } = useGetProjectByIdQuery({ id: projectId });
  const members = project?.members || [];
  const selectedUserId = value?.value?.user_id || '';

  const handleSelect = (userId: string) => {
    onChange({ user_id: userId });
  };

  const selectedMember = members.find((m: any) => m.user.user_id === selectedUserId);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Select value={selectedUserId} onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select user...">
            {selectedMember && (
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {selectedMember.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{selectedMember.user.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {members.map((member: any) => (
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
    </div>
  );
};
