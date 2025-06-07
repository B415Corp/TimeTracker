import { EditableFieldFormFeature } from "@/features/forms/EditableFieldFormFeature";

interface Props {
  value: string;
  action: (value: string) => void;
}

/**
 * Widget-прокси: просто вызывает feature-компонент EditableFieldFormFeature
 */
export default function EditableFieldForm(props: Props) {
  return <EditableFieldFormFeature {...props} />;
}
