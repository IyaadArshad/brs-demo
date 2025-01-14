"use client";
import { useState } from "react";
import { CraftEditor, JSONContent } from "@sergeysova/craft";
import './styles.css';

export default function App() {
  const [content, setContent] = useState<JSONContent>({})
  return (
    <div style={{ backgroundColor: 'black' }}>
      {/* <CraftEditor 
        content={content} 
        onUpdate={(editor: { getJSON: () => JSONContent }) => setContent(editor.getJSON())}
        className="white-text"
      />
      */}
    </div>
  );
}