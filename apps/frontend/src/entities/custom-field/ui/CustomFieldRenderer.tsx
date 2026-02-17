import { CustomField, DocumentFieldValue, FieldType } from '@shared/types/document.types';
import { TextFieldInput } from './TextFieldInput';
import { NumberFieldInput } from './NumberFieldInput';
import { SelectFieldInput } from './SelectFieldInput';
import { DateFieldInput } from './DateFieldInput';
import { CheckboxFieldInput } from './CheckboxFieldInput';
import { UrlFieldInput } from './UrlFieldInput';
import { UserFieldInput } from './UserFieldInput';
import { RelationFieldInput } from './RelationFieldInput';
import { TagsFieldInput } from './TagsFieldInput';

interface CustomFieldRendererProps {
  field: CustomField;
  value?: DocumentFieldValue;
  onUpdate: (fieldId: string, value: any) => void;
}

export const CustomFieldRenderer = ({ field, value, onUpdate }: CustomFieldRendererProps) => {
  const handleChange = (newValue: any) => {
    onUpdate(field.field_id, newValue);
  };

  switch (field.type) {
    case FieldType.TEXT:
      return <TextFieldInput field={field} value={value} onChange={handleChange} />;
    
    case FieldType.NUMBER:
      return <NumberFieldInput field={field} value={value} onChange={handleChange} />;
    
    case FieldType.SELECT:
      return <SelectFieldInput field={field} value={value} onChange={handleChange} />;
    
    case FieldType.MULTI_SELECT:
      return <SelectFieldInput field={field} value={value} onChange={handleChange} isMulti />;
    
    case FieldType.DATE:
      return <DateFieldInput field={field} value={value} onChange={handleChange} />;
    
    case FieldType.CHECKBOX:
      return <CheckboxFieldInput field={field} value={value} onChange={handleChange} />;
    
    case FieldType.URL:
      return <UrlFieldInput field={field} value={value} onChange={handleChange} />;
    
    case FieldType.EMAIL:
      return <TextFieldInput field={field} value={value} onChange={handleChange} type="email" />;
    
    case FieldType.PHONE:
      return <TextFieldInput field={field} value={value} onChange={handleChange} type="tel" />;
    
    case FieldType.USER:
      return <UserFieldInput field={field} value={value} onChange={handleChange} />;
    
    case FieldType.RELATION:
      return <RelationFieldInput field={field} value={value} onChange={handleChange} />;
    
    case FieldType.TAGS:
      return <TagsFieldInput field={field} value={value} onChange={handleChange} />;
    
    default:
      return <div className="text-gray-400 text-sm">Field type not implemented</div>;
  }
};
