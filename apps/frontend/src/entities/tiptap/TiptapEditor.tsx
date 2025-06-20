import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import Code from '@tiptap/extension-code';
import Link from '@tiptap/extension-link';
import { Button } from '@ui/button';
import { Bold as BoldIcon, Italic as ItalicIcon, List, ListOrdered, Heading1, Heading2, Code2, Link2Icon } from 'lucide-react';

export const TiptapEditor: React.FC<{
  initialContent?: string;
  onChange: (content: string) => void;
}> = ({ initialContent = '', onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({ levels: [1, 2] }),
      Code,
      Link.configure({ openOnClick: false }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Синхронизация внешнего initialContent с текущим редактором
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor]);

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      {editor && (
        <div className="flex flex-wrap gap-1 bg-muted/50 p-2 rounded-md border border-border">
          <Button size="icon" variant={editor.isActive('bold') ? 'default' : 'ghost'} onClick={() => editor.chain().focus().toggleBold().run()}><BoldIcon className="w-4 h-4"/></Button>
          <Button size="icon" variant={editor.isActive('italic') ? 'default' : 'ghost'} onClick={() => editor.chain().focus().toggleItalic().run()}><ItalicIcon className="w-4 h-4"/></Button>
          <Button size="icon" variant={editor.isActive('code') ? 'default' : 'ghost'} onClick={() => editor.chain().focus().toggleCode().run()}><Code2 className="w-4 h-4"/></Button>
          <Button size="icon" variant={editor.isActive('bulletList') ? 'default' : 'ghost'} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4"/></Button>
          <Button size="icon" variant={editor.isActive('orderedList') ? 'default' : 'ghost'} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4"/></Button>
          <Button size="icon" variant={editor.isActive('heading', {level:1}) ? 'default' : 'ghost'} onClick={() => editor.chain().focus().toggleHeading({level:1}).run()}><Heading1 className="w-4 h-4"/></Button>
          <Button size="icon" variant={editor.isActive('heading', {level:2}) ? 'default' : 'ghost'} onClick={() => editor.chain().focus().toggleHeading({level:2}).run()}><Heading2 className="w-4 h-4"/></Button>
          <Button size="icon" variant={editor.isActive('link') ? 'default' : 'ghost'} onClick={() => { const previousUrl = editor.getAttributes('link').href; const url = window.prompt('Введите URL', previousUrl || 'https://'); if (url === null) return; if (url === '') {editor.chain().focus().extendMarkRange('link').unsetLink().run(); return;} editor.chain().focus().extendMarkRange('link').setLink({href: url}).run(); }}><Link2Icon className="w-4 h-4"/></Button>
        </div>
      )}

      <EditorContent editor={editor} className="prose prose-invert min-h-32" />
    </div>
  );
};


