"use client";

import { NoteBlockFeature } from "@/features/notes/NoteBlockFeature";

import type { NoteBlockProps } from "@/features/notes/NoteBlockFeature";

/**
 * Widget-прокси: просто вызывает feature-компонент NoteBlockFeature
 */
export const NoteBlock = (props: NoteBlockProps) => {
  return <NoteBlockFeature {...props} />;
};
