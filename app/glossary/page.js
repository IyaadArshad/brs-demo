import React from 'react';

const glossaryTerms = [
  { term: "BRS", definition: "Business Requirements Specification" },
  { term: "JSON", definition: "JavaScript Object Notation" },
  { term: "Markdown", definition: "Lightweight markup language" }
];

function Glossary() {
  return (
    <div>
      <h2>Smart Glossary</h2>
      <ul>
        {glossaryTerms.map((item, idx) => (
          <li key={idx}>
            <strong>{item.term}:</strong> {item.definition}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Glossary;