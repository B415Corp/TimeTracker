import { CustomField, DocumentFieldValue } from '@shared/types/document.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';
import { useGetDocumentsByProjectQuery } from '@shared/api/documentsApi';
import { FileText } from 'lucide-react';

interface RelationFieldInputProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onChange: (value: any) => void;
}

export const RelationFieldInput = ({ field, value, onChange }: RelationFieldInputProps) => {
  const projectId = field.project_id;
  const { data: documents = [] } = useGetDocumentsByProjectQuery(projectId);
  const selectedDocId = value?.value?.document_id || '';

  const handleSelect = (documentId: string) => {
    onChange({ document_id: documentId });
  };

  const selectedDoc = documents.find((d) => d.document_id === selectedDocId);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Select value={selectedDocId} onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Select document...">
            {selectedDoc && (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>{selectedDoc.title || 'Untitled'}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {documents.map((doc) => (
            <SelectItem key={doc.document_id} value={doc.document_id}>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>{doc.title || 'Untitled'}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
