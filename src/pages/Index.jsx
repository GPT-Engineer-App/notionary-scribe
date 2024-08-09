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
      const handleKeyDown = ({ event }) => {
        if (event.key === '/') {
          event.preventDefault();
          const { top, left } = editor.view.coordsAtPos(editor.state.selection.from);
          setMenuPosition({ top, left });
          setShowMenu(true);
        }
      };

      const handleKeyUp = ({ event }) => {
        if (event.key !== '/' && showMenu) {
          setShowMenu(false);
        }
      };

      editor.on('keydown', handleKeyDown);
      editor.on('keyup', handleKeyUp);

      return () => {
        editor.off('keydown', handleKeyDown);
        editor.off('keyup', handleKeyUp);
      };
    }
  }, [editor, showMenu]);

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
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col flex-grow">
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
        <div className="relative border rounded-md flex-grow flex flex-col overflow-hidden">
          <EditorContent
            editor={editor}
            className="w-full flex-grow overflow-y-auto p-4"
            onPaste={handlePaste}
          />
          {showMenu && (
            <div
              className="absolute bg-white shadow-lg rounded-lg p-2 z-10 border border-gray-200"
              style={{ top: menuPosition.top + 20, left: menuPosition.left }}
            >
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'h1', icon: 'H1', label: 'Heading 1' },
                  { type: 'h2', icon: 'H2', label: 'Heading 2' },
                  { type: 'h3', icon: 'H3', label: 'Heading 3' },
                  { type: 'bulletList', icon: <List className="h-4 w-4" />, label: 'Bullet List' },
                  { type: 'orderedList', icon: <ListOrdered className="h-4 w-4" />, label: 'Numbered List' },
                  { type: 'image', icon: <ImageIcon className="h-4 w-4" />, label: 'Image' },
                  { type: 'codeBlock', icon: <Code className="h-4 w-4" />, label: 'Code Block' },
                  { type: 'blockquote', icon: <Quote className="h-4 w-4" />, label: 'Blockquote' },
                ].map(({ type, icon, label }) => (
                  <Button
                    key={type}
                    variant="ghost"
                    className="justify-start w-full"
                    onClick={() => insertBlock(type)}
                  >
                    <div className="flex items-center w-full">
                      <span className="mr-2">{icon}</span>
                      <span>{label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
