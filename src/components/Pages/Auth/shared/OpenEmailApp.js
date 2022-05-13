import React from "react";

function OpenEmailApp() {
  return (
    <div className="email-helpers-div">
      <a target="_blank" href="mailto:" rel="noopener noreferrer">
        Open Your Email App
      </a>
      <a
        style={{
          marginLeft: 20,
        }}
        target="_blank"
        href="https://www.gmail.com"
        rel="noopener noreferrer"
      >
        Open Gmail Online{" "}
      </a>
    </div>
  );
}

export default OpenEmailApp;
