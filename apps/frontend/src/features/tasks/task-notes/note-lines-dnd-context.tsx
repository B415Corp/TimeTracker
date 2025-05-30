import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { NoteLine } from "./note-line.types";

interface NoteLinesDndContextProps {
  lines: NoteLine[];
  onMove: (oldIndex: number, newIndex: number, newParentId?: string | null) => void;
  onDragMove?: (offsetX: number, offsetY?: number) => void;
  children: (props: { isDragging: boolean; dragOverId: string | null }) => React.ReactNode;
}

export const NoteLinesDndContext: React.FC<NoteLinesDndContextProps> = ({ lines, onMove, onDragMove, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Простое состояние для отслеживания перетаскивания
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    console.log('Drag started:', event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('handleDragEnd:', { activeId: active.id, overId: over?.id });
    
    // Скрываем индикаторы
    setIsDragging(false);
    setDragOverId(null);
    
    if (active.id !== over?.id && over?.id) {
      const oldIndex = lines.findIndex(l => l.id === active.id);
      const newIndex = lines.findIndex(l => l.id === over?.id);
      
      console.log('DND indices:', { oldIndex, newIndex });
      
      if (oldIndex !== -1 && newIndex !== -1) {
        onMove(oldIndex, newIndex);
      }
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (onDragMove && event.delta) {
      onDragMove(event.delta.x, event.delta.y);
    }
    
    // Просто отслеживаем над каким элементом находимся
    if (event.over?.id && event.active?.id !== event.over?.id) {
      setDragOverId(event.over.id as string);
    } else {
      setDragOverId(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <SortableContext items={lines.map(l => l.id)} strategy={verticalListSortingStrategy}>
        {children({ isDragging, dragOverId })}
      </SortableContext>
    </DndContext>
  );
}; 