import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddWorkout from "../pages/AddWorkout";
import { WebSocketContext } from "../WebSocketProvider";


const mockSendMessage = jest.fn();

const renderWithContext = (component) => {
  return render(
    <WebSocketContext.Provider value={{ sendMessage: mockSendMessage }}>
      <BrowserRouter>{component}</BrowserRouter>
    </WebSocketContext.Provider>
  );
};

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
  localStorage.setItem("token", "mockToken"); 
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("AddWorkout Page", () => {

  test("renders form fields correctly", () => {
    renderWithContext(<AddWorkout />);

    expect(screen.getByLabelText(/Exercise Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sets:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reps:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Workout/i })).toBeInTheDocument();
  });

  test("shows error message when fields are empty", async () => {
    localStorage.clear(); 
    renderWithContext(<AddWorkout />);
  
    fireEvent.click(screen.getByRole("button", { name: /Add Workout/i }));
  
    // Use findByText to wait for the async rendering of the error message
    const errorMessage = await screen.findByText(/You need to log in to add a workout./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test("submits the form successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );
  
    renderWithContext(<AddWorkout />);
  
    fireEvent.change(screen.getByLabelText(/Exercise Name:/i), {
      target: { value: "Push Ups" },
    });
    fireEvent.change(screen.getByLabelText(/Sets:/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/Reps:/i), {
      target: { value: "12" },
    });
    fireEvent.change(screen.getByLabelText(/Weight:/i), {
      target: { value: "0" },
    });
  
    fireEvent.click(screen.getByRole("button", { name: /Add Workout/i }));
  
    // Use `findBy` to handle async state updates
    await screen.findByRole("button", { name: /Add Workout/i });
  
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/workouts",
      expect.anything()
    );
    expect(mockSendMessage).toHaveBeenCalled(); // Ensure WebSocket sendMessage is called
  });
});
