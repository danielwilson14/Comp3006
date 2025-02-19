import React from 'react';
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import WorkoutStats from "../pages/WorkoutStats";

console.log('Test file loaded');

// Helper function to render with Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

beforeEach(() => {
  // Mock localStorage
  localStorage.setItem("userId", "mockUserId");
  localStorage.setItem("token", "mockToken");
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("WorkoutStats Page", () => {
  test("displays loading state initially", () => {
    console.log('Running "displays loading state initially" test');
    renderWithRouter(<WorkoutStats />);
    expect(screen.getByText(/Loading workout stats.../i)).toBeInTheDocument();
  });

  test("displays error message if fetch fails", async () => {
    console.log('Running "displays error message if fetch fails" test');
    // Mock a failed fetch response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch workout stats" }),
    });

    renderWithRouter(<WorkoutStats />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch workout stats/i)).toBeInTheDocument();
    });
  });

  test("displays workout stats correctly", async () => {
    console.log('Running "displays workout stats correctly" test');
    // Mock a successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalWorkouts: 5,
        totalSets: 20,
        totalReps: 100,
        totalWeight: 500,
        mostPerformedExercise: "Squats",
      }),
    });

    renderWithRouter(<WorkoutStats />);

    await waitFor(() => {
      expect(screen.getByText("Total Workouts:")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("Total Sets:")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
      expect(screen.getByText("Total Reps:")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("Total Weight Lifted:")).toBeInTheDocument();
      expect(screen.getByText("500 kg")).toBeInTheDocument(); // Combined text
      expect(screen.getByText("Most Performed Exercise:")).toBeInTheDocument();
      expect(screen.getByText("Squats")).toBeInTheDocument();
    });
  });
});
