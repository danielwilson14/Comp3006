import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";

test("renders navigation links", () => {
  render(
    <BrowserRouter>
      <NavigationBar />
    </BrowserRouter>
  );

  // Check if navigation links are displayed
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Workout/i)).toBeInTheDocument();
  expect(screen.getByText(/View Workouts/i)).toBeInTheDocument();
  expect(screen.getByText(/Logout/i)).toBeInTheDocument();
});
