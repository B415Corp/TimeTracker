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
import { NoteLine } from "./note-line.types";
import { SortableNoteLineItem } from "./note-line-item";

interface NoteLinesDndTreeContextProps {
  lines: NoteLine[];
  onMove: (sourceId: string, destinationId: string | null, position: number) => void;
  children: React.ReactNode;
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

// Собрать ветку для DragOverlay
function renderBranch(line: NoteLine, lines: NoteLine[], level: number = 0): React.ReactNode {
  return (
    <React.Fragment key={line.id}>
      <SortableNoteLineItem
        line={line}
        level={level}
        onChange={() => {}}
        onTypeChange={() => {}}
        onKeyDown={() => {}}
        onDelete={() => {}}
        dragOverlay // специальный проп для DragOverlay
      />
      {lines.filter(l => l.parentId === line.id).map(child => renderBranch(child, lines, level + 1))}
    </React.Fragment>
  );
}

// DND-контекст для вложенных заметок
export const NoteLinesDndTreeContext: React.FC<NoteLinesDndTreeContextProps> = ({
  lines,
  onMove,
  children,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Состояния для dnd
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [draggedLine, setDraggedLine] = React.useState<NoteLine | null>(null);

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
        <DragOverlay dropAnimation={null}>
          {activeId && draggedLine ? renderBranch(draggedLine, lines) : null}
        </DragOverlay>
      </DndContext>
    </DndTreeContext.Provider>
  );
}; 