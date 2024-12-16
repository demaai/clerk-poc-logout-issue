import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useAuth } from "@clerk/clerk-react";

function App() {
  const [count, setCount] = useState(0);
  const { signOut } = useAuth();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <button type="button" onClick={signOut}>
          Sign out
        </button>
      </header>
    </div>
  );
}

export default App;
