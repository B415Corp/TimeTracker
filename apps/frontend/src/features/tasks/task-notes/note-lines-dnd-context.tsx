import React from "react";
import { createPortal } from "react-dom";
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
  children: React.ReactNode;
}

export const NoteLinesDndContext: React.FC<NoteLinesDndContextProps> = ({ lines, onMove, onDragMove, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Состояние для отслеживания активного перетаскивания
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOverId, setDragOverId] = React.useState<string | null>(null);
  const [dropIndicatorStyle, setDropIndicatorStyle] = React.useState<React.CSSProperties>({});

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Скрываем индикаторы
    setIsDragging(false);
    setDragOverId(null);
    setDropIndicatorStyle({});
    
    if (active.id !== over?.id) {
      const oldIndex = lines.findIndex(l => l.id === active.id);
      const newIndex = lines.findIndex(l => l.id === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onMove(oldIndex, newIndex);
      }
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (onDragMove && event.delta) {
      onDragMove(event.delta.x, event.delta.y);
    }
    
    // Обновляем позицию индикатора
    if (event.over?.id && event.active?.id !== event.over?.id) {
      setDragOverId(event.over.id as string);
      
      // Находим элемент и позиционируем индикатор
      const element = document.querySelector(`[data-line-id="${event.over.id}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        
        // Определяем, в какой части элемента находится курсор
        const mouseY = (event as any).activatorEvent?.clientY || rect.top + rect.height / 2;
        const elementCenter = rect.top + rect.height / 2;
        const insertBefore = mouseY < elementCenter;
        
        // Находим индексы для определения правильной позиции
        const activeIndex = lines.findIndex(l => l.id === event.active?.id);
        const overIndex = lines.findIndex(l => l.id === event.over?.id);
        
        let targetTop = rect.top;
        
        if (insertBefore) {
          // Показываем индикатор перед элементом
          targetTop = rect.top - 1;
        } else {
          // Показываем индикатор после элемента
          targetTop = rect.bottom - 1;
        }
        
        // Если перемещение в пределах соседних элементов, корректируем позицию
        if (Math.abs(activeIndex - overIndex) === 1) {
          if (activeIndex < overIndex && !insertBefore) {
            // Перемещение вниз к соседнему элементу - показываем после него
            targetTop = rect.bottom - 1;
          } else if (activeIndex > overIndex && insertBefore) {
            // Перемещение вверх к соседнему элементу - показываем перед ним
            targetTop = rect.top - 1;
          }
        }
        
        setDropIndicatorStyle({
          position: "fixed",
          left: rect.left,
          width: rect.width,
          height: 2,
          top: targetTop,
          background: "#2563eb",
          borderRadius: 1,
          zIndex: 9999,
          pointerEvents: "none",
          opacity: 0.9,
          boxShadow: "0 0 6px rgba(37, 99, 235, 0.6)",
        });
      }
    } else {
      setDragOverId(null);
      setDropIndicatorStyle({});
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
      >
        <SortableContext items={lines.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {children}
        </SortableContext>
      </DndContext>
      
      {/* Индикатор в портале для правильного позиционирования */}
      {isDragging && dragOverId && typeof window !== 'undefined' && 
        createPortal(
          <div style={dropIndicatorStyle} />,
          document.body
        )
      }
    </>
  );
}; 