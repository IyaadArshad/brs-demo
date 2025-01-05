import React from 'react';

const sampleScreen = {
  title: "Login Screen",
  components: [
    { type: "text", content: "Welcome, please login:" },
    { type: "input", placeholder: "Username" },
    { type: "input", placeholder: "Password" },
    { type: "button", label: "Sign In" }
  ]
};

function ScreenMockup() {
  return (
    <div>
      <h2>Screen Mockup</h2>
      <div className="mockup-container">
        <h3>{sampleScreen.title}</h3>
        {sampleScreen.components.map((cmp, idx) => {
          if (cmp.type === "text") return <p key={idx}>{cmp.content}</p>;
          if (cmp.type === "input") return <input key={idx} placeholder={cmp.placeholder} />;
          if (cmp.type === "button") return <button key={idx}>{cmp.label}</button>;
          return null;
        })}
      </div>
    </div>
  );
}

export default ScreenMockup;