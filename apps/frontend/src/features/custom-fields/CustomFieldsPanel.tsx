import { useState } from 'react';
import { useGetFieldsByProjectQuery, useGetDocumentFieldValuesQuery, useSetFieldValueMutation } from '@shared/api/customFieldsApi';
import { CustomFieldRenderer } from '@entities/custom-field/ui/CustomFieldRenderer';
import { Button } from '@ui/button';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@ui/collapsible';

interface CustomFieldsPanelProps {
  documentId: string;
  projectId: string;
}

export const CustomFieldsPanel = ({ documentId, projectId }: CustomFieldsPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: fields = [] } = useGetFieldsByProjectQuery(projectId);
  const { data: values = [] } = useGetDocumentFieldValuesQuery(documentId);
  const [updateValue] = useSetFieldValueMutation();

  const handleUpdateField = async (fieldId: string, value: any) => {
    try {
      await updateValue({
        documentId,
        fieldId,
        value,
      }).unwrap();
    } catch (error) {
      console.error('Failed to update field value:', error);
    }
  };

  if (fields.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
      <CollapsibleTrigger asChild>
        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          Properties ({fields.length})
        </button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-4">
        {fields.map((field) => {
          const fieldValue = values.find((v) => v.field_id === field.field_id);
          
          return (
            <div key={field.field_id}>
              <CustomFieldRenderer
                field={field}
                value={fieldValue}
                onUpdate={handleUpdateField}
              />
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};
