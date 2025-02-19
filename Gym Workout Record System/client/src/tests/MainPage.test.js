import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MainPage from "../pages/MainPage";

test("renders MainPage with links", () => {
  render(
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  );

  // Check heading and paragraph
  expect(screen.getByText("Welcome to the Home Page")).toBeInTheDocument();
  expect(screen.getByText("You are now logged in!")).toBeInTheDocument();

  // Check navigation buttons
  expect(screen.getByRole("button", { name: /Add Workout/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /View Workouts/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /View Workout Stats/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Update Profile/i })).toBeInTheDocument();
});
