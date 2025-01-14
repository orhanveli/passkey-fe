import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex justify-center gap-4">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className="w-24 h-24 hover:scale-110 transition-transform"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="w-24 h-24 hover:scale-110 transition-transform"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-3xl font-bold text-center my-8">Vite + React</h1>
      <div className="card p-6 bg-white rounded-lg shadow-md">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs text-center mt-8 text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
