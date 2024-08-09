import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

const Index = () => {
  const [title, setTitle] = useState('Untitled');
  const [content, setContent] = useState('');

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
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
          <Button variant="outline" size="icon" onClick={() => handleFormat('insertUnorderedList')}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleFormat('insertOrderedList')}>
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
        <div
          className="w-full min-h-[300px] p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          contentEditable
          onInput={(e) => setContent(e.target.innerHTML)}
          dangerouslySetInnerHTML={{ __html: content }}
          placeholder="Start typing here..."
        />
      </div>
    </div>
  );
};

export default Index;
