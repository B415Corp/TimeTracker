console.log('FILE NOTE-LINES-DND-CONTEXT');

import React, { createContext, useContext } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { NoteLine, NoteLineType } from "./note-line.types";
import { SortableNoteLineItem } from "./note-line-item";

interface NoteLinesDndTreeContextProps {
  lines: NoteLine[];
  onMove: (sourceId: string, destinationId: string | null, position: number) => void;
  children: React.ReactNode;
  onChange: (id: string, value: string) => void;
  onTypeChange: (id: string, type: NoteLineType) => void;
  onKeyDown: (e: React.KeyboardEvent, line: NoteLine) => void;
  onDelete: (id: string) => void;
}

interface DndTreeContextValue {
  activeId: string | null;
  lines: NoteLine[];
}
const DndTreeContext = createContext<DndTreeContextValue>({ activeId: null, lines: [] });
export const useDndTreeContext = () => useContext(DndTreeContext);

// Вспомогательная функция для построения дерева из flat массива
function buildTree(lines: NoteLine[], parentId: string | null = null): NoteLine[] {
  return lines
    .filter((line) => line.parentId === parentId)
    .map((line) => ({
      ...line,
      children: buildTree(lines, line.id),
    }));
}

// Вспомогательная функция для поиска по id
function findLineById(lines: NoteLine[], id: string): NoteLine | undefined {
  return lines.find((l) => l.id === id);
}

class DndErrorBoundary extends React.Component<{children: React.ReactNode}, {error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any, info: any) {
    console.log('DND_ERROR_BOUNDARY', error, info);
  }
  render() {
    if (this.state.error) {
      return <div style={{color:'red'}}>DND ERROR: {String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}

// Собрать ветку для DragOverlay
export function NoteLinesDndTreeContext(props: NoteLinesDndTreeContextProps) {
  return (
    <DndErrorBoundary>
      <NoteLinesDndTreeContextInner {...props} />
    </DndErrorBoundary>
  );
}

function NoteLinesDndTreeContextInner({
  lines,
  onMove,
  children,
  onChange,
  onTypeChange,
  onKeyDown,
  onDelete,
}: NoteLinesDndTreeContextProps) {
  console.log('RENDER NoteLinesDndTreeContext');
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Состояния для dnd
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [draggedLine, setDraggedLine] = React.useState<NoteLine | null>(null);

  console.log('RENDER NoteLinesDndTreeContext', {linesCount: lines.length});

  // Обработка начала перетаскивания
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const line = findLineById(lines, event.active.id as string);
    if (line) {
      setDraggedLine(line);
    }
  };

  // Обработка завершения перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedLine(null);
    if (!over || active.id === over.id) return;
    // Определяем позицию и родителя
    const destinationId = over.id as string;
    const sourceId = active.id as string;
    // Для простоты: вставляем в того же родителя, что и over
    const overLine = findLineById(lines, destinationId);
    const parentId = overLine?.parentId ?? null;
    const siblings = lines.filter((l) => l.parentId === parentId);
    const newIndex = siblings.findIndex((l) => l.id === destinationId);
    console.log('DnD handleDragEnd', {sourceId, destinationId, parentId, newIndex, siblings: siblings.map(s=>s.id)});
    onMove(sourceId, parentId, newIndex);
  };

  // Рендерим DndContext и SortableContext для всех элементов
  return (
    <DndTreeContext.Provider value={{ activeId, lines }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={lines.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
        <div style={{display:'none'}} />
      </DndContext>
    </DndTreeContext.Provider>
  );
}

function renderBranch(
  line: NoteLine,
  lines: NoteLine[],
  level: number = 0,
  onChange: (id: string, value: string) => void,
  onTypeChange: (id: string, type: NoteLineType) => void,
  onKeyDown: (e: React.KeyboardEvent, line: NoteLine) => void,
  onDelete: (id: string) => void
): React.ReactNode {
  console.log('RENDER renderBranch', line.id, {level});
  return (
    <React.Fragment key={line.id}>
      <SortableNoteLineItem
        line={line}
        level={level}
        onChange={onChange}
        onTypeChange={onTypeChange}
        onKeyDown={(e) => onKeyDown(e, line)}
        onDelete={onDelete}
        dragOverlay // специальный проп для DragOverlay
      />
      {lines.filter(l => l.parentId === line.id).map(child => renderBranch(child, lines, level + 1, onChange, onTypeChange, onKeyDown, onDelete))}
    </React.Fragment>
  );
} 