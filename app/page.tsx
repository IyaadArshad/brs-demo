import React from 'react';
import Link from 'next/link';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <Link href="/">Editor</Link>
        <Link href="/assisted">Assisted</Link>
        <Link href="/mockup">Screen Mockup</Link>
        <Link href="/glossary">Glossary</Link>
        <Link href="/settings">Settings</Link>
      </nav>
    </div>
  );
}

export default App;