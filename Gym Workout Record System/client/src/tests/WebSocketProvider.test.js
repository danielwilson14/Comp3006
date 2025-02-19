import { render, screen, act } from '@testing-library/react';
import { WebSocketProvider, WebSocketContext } from '../WebSocketProvider';
import { useContext } from 'react';

// Helper component to test WebSocket context
const TestComponent = () => {
  const { websocket, sendMessage } = useContext(WebSocketContext);

  console.log("WebSocket readyState in TestComponent:", websocket?.readyState);


  return (
    <div>
      <button onClick={() => sendMessage({ test: 'message' })}>Send Message</button>
      <p>
        WebSocket Status:{' '}
        {websocket
          ? websocket.readyState === 0
            ? 'Connecting'
            : websocket.readyState === 1
            ? 'Open'
            : websocket.readyState === 2
            ? 'Closing'
            : websocket.readyState === 3
            ? 'Closed'
            : 'Unknown'
          : 'Not Initialized'}
      </p>
    </div>
  );
};

test('WebSocketProvider initializes and provides context', async () => {
    const mockWebSocket = new global.WebSocket('ws://localhost:5000');
  
    jest.spyOn(global, 'WebSocket').mockImplementation(() => mockWebSocket);
  
    render(
      <WebSocketProvider>
        <TestComponent />
      </WebSocketProvider>
    );
  
    // Log initial readyState
    console.log("Initial Mock WebSocket ReadyState:", mockWebSocket.readyState);
  
    // Assert initial state is "Connecting"
    console.log("Checking if 'Connecting' is rendered...");
    expect(
      await screen.findByText(/WebSocket Status: Connecting/i)
    ).toBeInTheDocument();
  
    act(() => {
        console.log("Simulating 'open' event...");
        console.log("Before triggering 'open': mockWebSocket.readyState =", mockWebSocket.readyState);
        
        mockWebSocket.triggerEvent('open');
        
        console.log("After triggering 'open': mockWebSocket.readyState =", mockWebSocket.readyState);
      
        // Also, check if the `onopen` callback is defined and called
        console.log("mockWebSocket.onopen is defined:", typeof mockWebSocket.onopen === "function");
      });
  
    // Assert state after connection opens
    console.log("Checking if 'Open' is rendered...");
    expect(
      await screen.findByText(/WebSocket Status: Open/i)
    ).toBeInTheDocument();
  });
  
  
