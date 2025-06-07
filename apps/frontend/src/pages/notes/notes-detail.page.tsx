import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@ui/button";
import {
  ChevronLeft,
  Loader,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Type,
  Heading2,
  Heading1,
  Heading3,
  Link2Icon,
  Code2,
} from "lucide-react";
import {
  useEditNotesMutation,
  useGetNotesByIdQuery,
} from "@/shared/api/notes.service";
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
import { NoteEditForm } from "@/features/notes/forms/NoteEditForm";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("python", python);


function FloatingMenu({ editor }: { editor: Editor | null }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    if (!editor || !editor.isFocused) {
      setCoords(null);
      return;
    }
    const { from, to } = editor.state.selection;
    // Получаем координаты выделения или курсора
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);
    // Средняя точка между началом и концом выделения
    const left = (start.left + end.right) / 2;
    const top = Math.min(start.top, end.top);
    setCoords({ left, top });
  }, [editor, editor?.state.selection, editor?.isFocused]);

  if (!editor || !editor.isFocused) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      onMouseDown={e => e.preventDefault()}
      style={{
        position: "absolute",
        zIndex: 100,
        padding: "8px",
        backgroundColor: "#222",
        borderRadius: "6px",
        display: "flex",
        gap: "8px",
        color: "white",
        userSelect: "none",
        left: coords ? coords.left : 0,
        top: coords ? coords.top - 40 : 0, // чуть выше выделения/курсора
        pointerEvents: "auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        transition: "left 0.1s, top 0.1s",
      }}
    >
      <Button
        size="icon"
        variant={editor.isActive("bold") ? "default" : "outline"}
        onClick={() => {
          console.log("Bold button clicked", editor.getJSON());
          editor.chain().focus().toggleBold().run();
        }}
        aria-label="Bold"
        title="Жирный (Ctrl+B)"
      >
        <Bold size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("italic") ? "default" : "outline"}
        onClick={() => {
          console.log("Italic button clicked", editor.getJSON());
          editor.chain().focus().toggleItalic().run();
        }}
        aria-label="Italic"
        title="Курсив (Ctrl+I)"
      >
        <Italic size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("code") ? "default" : "outline"}
        onClick={() => {
          console.log("Code button clicked", editor.getJSON());
          editor.chain().focus().toggleCode().run();
        }}
        aria-label="Inline Code"
        title="Код"
      >
        <Code2 size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("codeBlock") ? "default" : "outline"}
        onClick={() => {
          console.log("CodeBlock button clicked", editor.getJSON());
          editor.chain().focus().toggleCodeBlock().run();
        }}
        aria-label="Code Block"
        title="Блок кода"
      >
        <Type size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        onClick={() => {
          console.log("BulletList button clicked", editor.getJSON());
          editor.chain().focus().toggleBulletList().run();
        }}
        aria-label="Bullet List"
        title="Маркированный список"
      >
        <List size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        onClick={() => {
          console.log("OrderedList button clicked", editor.getJSON());
          editor.chain().focus().toggleOrderedList().run();
        }}
        aria-label="Ordered List"
        title="Нумерованный список"
      >
        <ListOrdered size={16} />
      </Button>
      <Button
        size="icon"
        variant={
          editor.isActive("heading", { level: 1 }) ? "default" : "outline"
        }
        onClick={() => {
          console.log("Heading1 button clicked", editor.getJSON());
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        aria-label="Heading 1"
        title="Заголовок 1"
      >
        <Heading1 size={16} />
      </Button>
      <Button
        size="icon"
        variant={
          editor.isActive("heading", { level: 2 }) ? "default" : "outline"
        }
        onClick={() => {
          console.log("Heading2 button clicked", editor.getJSON());
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        aria-label="Heading 2"
        title="Заголовок 2"
      >
        <Heading2 size={16} />
      </Button>
      <Button
        size="icon"
        variant={
          editor.isActive("heading", { level: 3 }) ? "default" : "outline"
        }
        onClick={() => {
          console.log("Heading3 button clicked", editor.getJSON());
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        aria-label="Heading 3"
        title="Заголовок 3"
      >
        <Heading3 size={16} />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive("link") ? "default" : "outline"}
        onClick={() => {
          console.log("Link button clicked", editor.getJSON());
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("Введите URL", previousUrl || "https://");
          if (url === null) return; // отмена
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
        aria-label="Link"
        title="Ссылка"
      >
        {editor.isActive("link") ? (
          <Link2Icon size={16} />
        ) : (
          <LinkIcon size={16} />
        )}
      </Button>
    </div>
  );
}

export default function NotesDetailPage() {
  const { id } = useParams();
  if (!id) return null;
  return <NoteEditForm noteId={id} />;
}
