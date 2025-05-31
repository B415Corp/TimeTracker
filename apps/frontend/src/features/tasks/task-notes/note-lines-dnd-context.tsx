import React from "react";
import {
  DndContext,
  closestCenter,
  closestCorners,
  pointerWithin,
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
  children: (props: { 
    isDragging: boolean; 
    dragOverId: string | null;
    insertPosition?: 'before' | 'after';
  }) => React.ReactNode;
}

export const NoteLinesDndContext: React.FC<NoteLinesDndContextProps> = ({ lines, onMove, onDragMove, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Простое состояние для отслеживания перетаскивания
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);
  const [insertPosition, setInsertPosition] = React.useState<'before' | 'after'>('after');

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
    setInsertPosition('after');
    
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
      const newDragOverId = event.over.id as string;
      
      // Определяем позицию вставки на основе индексов
      const activeIndex = lines.findIndex(l => l.id === event.active?.id);
      const overIndex = lines.findIndex(l => l.id === newDragOverId);
      
      // Если перетаскиваем сверху вниз - вставляем после, снизу вверх - перед
      const insertPos = activeIndex < overIndex ? 'after' : 'before';
      
      console.log('DragMove over element:', {
        activeId: event.active?.id,
        overId: newDragOverId,
        activeIndex,
        overIndex,
        insertPosition: insertPos,
        previousDragOverId: dragOverId
      });
      
      // Находим линию чтобы понять её уровень
      const overLine = lines.find(l => l.id === newDragOverId);
      const activeLine = lines.find(l => l.id === event.active?.id);
      
      console.log('Lines info:', {
        overLine: overLine ? { id: overLine.id, content: overLine.content, parentId: overLine.parentId } : null,
        activeLine: activeLine ? { id: activeLine.id, content: activeLine.content, parentId: activeLine.parentId } : null
      });
      
      setDragOverId(newDragOverId);
      setInsertPosition(insertPos);
    } else {
      if (dragOverId !== null) {
        console.log('Clearing dragOverId');
      }
      setDragOverId(null);
      setInsertPosition('after');
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <SortableContext items={lines.map(l => l.id)} strategy={verticalListSortingStrategy}>
        {children({ isDragging, dragOverId, insertPosition })}
      </SortableContext>
    </DndContext>
  );
}; 