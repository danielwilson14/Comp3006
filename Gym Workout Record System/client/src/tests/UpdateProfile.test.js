import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UpdateProfile from "../pages/UpdateProfile";

beforeAll(() => {
  window.alert = jest.fn(); // Mock alert
  window.confirm = jest.fn(); // Mock confirm
});

beforeEach(() => {
  global.fetch = jest.fn(); // Mock fetch globally

  // Fully mock localStorage
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn((key) => {
        if (key === "userId") return "mockUserId";
        if (key === "token") return "mockToken";
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(), // Mock clear function
    },
    writable: true,
  });
});

afterEach(() => {
  jest.restoreAllMocks(); // Restore all mocked/spied functions
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("UpdateProfile Page", () => {
  test("renders form fields correctly", () => {
    renderWithRouter(<UpdateProfile />);

    expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Update Profile/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Delete Account/i)).toBeInTheDocument();
  });

  test("updates profile successfully", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    renderWithRouter(<UpdateProfile />);

    fireEvent.change(screen.getByLabelText(/Username:/i), {
      target: { value: "newusername" },
    });
    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "newemail@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update Profile/i }));

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/users/mockUserId",
      expect.objectContaining({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mockToken",
        },
        body: JSON.stringify({
          username: "newusername",
          email: "newemail@example.com",
          password: "newpassword123",
        }),
      })
    );
    expect(
      await screen.findByText(/Profile updated successfully!/i)
    ).toBeInTheDocument();
  });

  test("handles account deletion with confirmation", async () => {
    window.confirm.mockReturnValue(true);
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    );

    renderWithRouter(<UpdateProfile />);

    fireEvent.click(screen.getByText(/Delete Account/i));

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/users/mockUserId",
      expect.objectContaining({
        method: "DELETE",
        headers: {
          Authorization: "Bearer mockToken",
        },
      })
    );

    await waitFor(() => {
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });
});
