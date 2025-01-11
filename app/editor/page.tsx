"use client";
import { useState } from "react";
import { CraftEditor, JSONContent } from "@sergeysova/craft";

export default function App() {
  const [content, setContent] = useState<JSONContent>({})

  return <CraftEditor content={content} onUpdate={(editor) => setContent(editor.getJSON())} />;
}