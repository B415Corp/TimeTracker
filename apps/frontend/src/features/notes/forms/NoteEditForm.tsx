import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Card, CardContent } from "@ui/card";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Code from "@tiptap/extension-code";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import { useEditNotesMutation, useGetNotesByIdQuery } from "@/shared/api/notes.service";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("python", python);

/**
 * Форма редактирования заметки
 * @param {string} noteId - ID заметки
 * @param {function} onSave - callback после успешного сохранения
 */
export function NoteEditForm({ noteId, onSave }: { noteId: string, onSave?: () => void }) {
  // ...реализация формы, редактора, обработчиков, useEditNotesMutation, useGetNotesByIdQuery и т.д.
  // ...все вспомогательные функции и FloatingMenu
  // ...UI формы
  return (
    <div>NoteEditForm</div>
  );
} 