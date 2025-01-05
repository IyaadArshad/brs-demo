import React, { useState } from 'react';

function EditorView() {
  const [markdown, setMarkdown] = useState("# Demo Document");
  const [aiChat, setAiChat] = useState("AI Chat output...");

  return (
    <div className="split-container">
      <div className="split-left">
        <h2>Editor</h2>
        <textarea 
          className="markdown-editor"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
      </div>
      <div className="split-right">
        <h2>Live Preview</h2>
        <div 
          className="markdown-preview" 
          dangerouslySetInnerHTML={{__html: markdown.replace(/\n/g, "<br>")}}
        />
        <h2>AI Chat</h2>
        <div className="ai-chat-box">
          <p>{aiChat}</p>
        </div>
      </div>
    </div>
  );
}

export default EditorView;