import { render, screen, fireEvent, } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";

function renderWithRouter(component) {
  return render(<BrowserRouter>{component}</BrowserRouter>);
}

describe("Login Page", () => {
  beforeEach(() => {
    // Mock the fetch function globally
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "fake-jwt-token" }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form fields", () => {
    renderWithRouter(<Login />);

    // Check for labels and button
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("logs in successfully", async () => {
    renderWithRouter(<Login />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "password123" },
    });

    // Click the login button
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Check if fetch was called with the correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/users/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      })
    );

  });

  it("shows error on failed login", async () => {
    // Mock fetch to retrn an error response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid email or password." }),
    });
    
    

    renderWithRouter(<Login />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "wrongpassword" },
    });

    // Click the login button
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    // Check if the error message is displayed
    expect(
      await screen.findByText(/Invalid email or password/i)
    ).toBeInTheDocument();
  });
});
