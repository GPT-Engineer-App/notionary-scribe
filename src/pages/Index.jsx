import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Code, Quote } from 'lucide-react';

const Index = () => {
  const [title, setTitle] = useState('Untitled');

  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Heading'
          }
          return 'Press "/" for commands, or start typing...'
        },
      }),
      Image,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      // You can save the content to local storage or send it to a server here
      console.log(json)
    },
  });

  useEffect(() => {
    if (editor) {
      editor.on('keyup', ({ event }) => {
        if (event.key === '/') {
          const { top, left } = editor.view.coordsAtPos(editor.state.selection.from);
          setMenuPosition({ top, left });
          setShowMenu(true);
        } else {
          setShowMenu(false);
        }
      });
    }
  }, [editor]);

  const insertBlock = (type) => {
    if (editor) {
      switch (type) {
        case 'h1':
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          break;
        case 'h2':
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          break;
        case 'h3':
          editor.chain().focus().toggleHeading({ level: 3 }).run();
          break;
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run();
          break;
        case 'image':
          addImage();
          break;
        case 'codeBlock':
          editor.chain().focus().toggleCodeBlock().run();
          break;
        case 'blockquote':
          editor.chain().focus().toggleBlockquote().run();
          break;
        default:
          break;
      }
      setShowMenu(false);
    }
  };

  const addImage = useCallback(() => {
    const url = window.prompt('Enter the URL of the image:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor]);

  const handlePaste = useCallback((event) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          event.preventDefault();
          const blob = items[i].getAsFile();
          const reader = new FileReader();
          reader.onload = (e) => {
            editor.chain().focus().setImage({ src: e.target.result }).run();
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    }
  }, [editor]);

  const handleFormat = (command) => {
    if (editor) {
      switch (command) {
        case 'bold':
          editor.chain().focus().toggleBold().run();
          break;
        case 'italic':
          editor.chain().focus().toggleItalic().run();
          break;
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run();
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold mb-4 border-none focus:outline-none"
          placeholder="Untitled"
        />
        <div className="mb-4 flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => handleFormat('bold')}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormat('italic')}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormat('bulletList')}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormat('orderedList')}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={addImage}>
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <EditorContent
            editor={editor}
            className="w-full min-h-[300px] p-2 focus:outline-none"
            onPaste={handlePaste}
          />
          {showMenu && (
            <div
              className="absolute bg-white shadow-lg rounded-lg p-2 z-10"
              style={{ top: menuPosition.top + 20, left: menuPosition.left }}
            >
              <Button variant="ghost" onClick={() => insertBlock('h1')}>Heading 1</Button>
              <Button variant="ghost" onClick={() => insertBlock('h2')}>Heading 2</Button>
              <Button variant="ghost" onClick={() => insertBlock('h3')}>Heading 3</Button>
              <Button variant="ghost" onClick={() => insertBlock('bulletList')}>Bullet List</Button>
              <Button variant="ghost" onClick={() => insertBlock('orderedList')}>Numbered List</Button>
              <Button variant="ghost" onClick={() => insertBlock('image')}>Image</Button>
              <Button variant="ghost" onClick={() => insertBlock('codeBlock')}>Code Block</Button>
              <Button variant="ghost" onClick={() => insertBlock('blockquote')}>Blockquote</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
