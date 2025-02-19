import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { WebSocketProvider } from "./WebSocketProvider.js"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
);
