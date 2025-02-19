import React, { createContext, useEffect, useState } from "react";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null); 
  const [, setIsConnected] = useState(false);

  useEffect(() => {
    const wsUrl = process.env.REACT_APP_WS_URL || "ws://localhost:5000";
    const socket = new WebSocket(wsUrl);

    // When the WebSocket connects:
    socket.onopen = () => {
      console.log("WebSocket connected to:", wsUrl, "ReadyState:", socket.readyState);
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message:", event.data);
    };

    // On error
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // On close
    socket.onclose = () => {
      console.log("WebSocket connection closed. ReadyState:", socket.readyState); 
      setIsConnected(false);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (msg) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket not open. Cannot send message:", msg);
    }
  };

  return (
    <WebSocketContext.Provider value={{ websocket: ws, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
