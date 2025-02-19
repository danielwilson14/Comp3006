import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ViewWorkouts from "../pages/ViewWorkouts";
import { WebSocketContext } from "../WebSocketProvider";

const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
};

const renderWithContext = (component) => {
  return render(
    <WebSocketContext.Provider value={{ websocket: mockWebSocket }}>
      <BrowserRouter>{component}</BrowserRouter>
    </WebSocketContext.Provider>
  );
};

jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});

describe("ViewWorkouts Page", () => {
  it("renders without crashing", () => {
    renderWithContext(<ViewWorkouts />);
    expect(screen.getByRole("heading", { level: 1, name: /View Workouts/i })).toBeInTheDocument();
    expect(screen.getByText(/No workouts found/i)).toBeInTheDocument();
  });

  it("handles WebSocket actions correctly", () => {
    renderWithContext(<ViewWorkouts />);
    expect(mockWebSocket.send).not.toHaveBeenCalled(); // Verify WebSocket `send` is not called initially
  });
});
