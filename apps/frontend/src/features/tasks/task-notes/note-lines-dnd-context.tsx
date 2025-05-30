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

  // Отладочное логирование состояния
  React.useEffect(() => {
    console.log('Indicator state:', { 
      isDragging, 
      dragOverId, 
      hasStyle: Object.keys(dropIndicatorStyle).length > 0,
      dropIndicatorStyle 
    });
  }, [isDragging, dragOverId, dropIndicatorStyle]);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('handleDragEnd:', { activeId: active.id, overId: over?.id });
    
    // Скрываем индикаторы
    setIsDragging(false);
    setDragOverId(null);
    setDropIndicatorStyle({});
    
    if (active.id !== over?.id && over?.id) {
      const oldIndex = lines.findIndex(l => l.id === active.id);
      const newIndex = lines.findIndex(l => l.id === over?.id);
      
      console.log('DND indices:', { oldIndex, newIndex });
      console.log('Active line:', lines[oldIndex]);
      console.log('Over line:', lines[newIndex]);
      
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
      const overId = event.over.id as string;
      setDragOverId(overId);
      
      console.log('DragMove over:', overId);
      
      // Находим элемент и позиционируем индикатор
      const element = document.querySelector(`[data-line-id="${overId}"]`);
      console.log('Found element:', element);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        console.log('Element rect:', rect);
        
        const style = {
          position: "fixed" as const,
          left: rect.left + 'px',
          width: rect.width + 'px', 
          height: '3px',
          top: (rect.bottom + 2) + 'px',
          background: "#2563eb",
          borderRadius: '2px',
          zIndex: 99999,
          pointerEvents: "none" as const,
          opacity: 1,
          boxShadow: "0 0 8px rgba(37, 99, 235, 0.8)",
          border: "1px solid #1d4ed8",
        };
        
        console.log('Setting indicator style:', style);
        setDropIndicatorStyle(style);
      } else {
        console.log('Element not found for:', overId);
        setDragOverId(null);
        setDropIndicatorStyle({});
      }
    } else {
      console.log('No valid over target');
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
      {isDragging && dragOverId && Object.keys(dropIndicatorStyle).length > 0 && typeof window !== 'undefined' && 
        createPortal(
          <div 
            style={dropIndicatorStyle}
            data-drop-indicator="true"
          />,
          document.body
        )
      }
    </>
  );
}; 