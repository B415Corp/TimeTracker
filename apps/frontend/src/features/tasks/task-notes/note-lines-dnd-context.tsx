import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragMoveEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { NoteLine } from "./note-line.types";

interface NoteLinesDndContextProps {
  lines: NoteLine[];
  onMove: (oldIndex: number, newIndex: number, nesting?: number) => void;
  onDragMove?: (offsetX: number) => void;
  children: React.ReactNode;
}

export const NoteLinesDndContext: React.FC<NoteLinesDndContextProps> = ({ lines, onMove, onDragMove, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
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
      onDragMove(event.delta.x);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
    >
      <SortableContext items={lines.map(l => l.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}; 