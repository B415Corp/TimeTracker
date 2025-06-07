import { NotesEditorFeature } from "@/features/notes/NotesEditorFeature";

import type { Block } from "@/features/notes/NotesEditorFeature";

interface Props {
  updateState: (state: Block[]) => void;
  sendToServer: () => void;
}

/**
 * Widget-прокси: просто вызывает feature-компонент NotesEditorFeature
 */
export function NotesEditor(props: Props) {
  return <NotesEditorFeature {...props} />;
}
