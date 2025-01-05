import React, { useState } from 'react';

function Settings() {
  const [theme, setTheme] = useState('Light');
  const [fontSize, setFontSize] = useState(14);
  const [aiModel, setAiModel] = useState('GPT-3.5');

  return (
    <div>
      <h2>Settings</h2>
      <div className="settings-item">
        <label>Theme:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option>Light</option>
          <option>Dark</option>
          <option>System default</option>
        </select>
      </div>
      <div className="settings-item">
        <label>Font Size:</label>
        <input 
          type="number" 
          value={fontSize} 
          min="8" 
          max="32" 
          onChange={(e) => setFontSize(e.target.value)}
        />
      </div>
      <div className="settings-item">
        <label>AI Model:</label>
        <select value={aiModel} onChange={(e) => setAiModel(e.target.value)}>
          <option>GPT-3.5</option>
          <option>GPT-4</option>
          <option>Custom API endpoint</option>
        </select>
      </div>
    </div>
  );
}

export default Settings;