import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import MainPage from '../pages/MainPage'; // Import the MainPage component directly

test('renders login page by default', () => {
  render(
    <App RouterProvider={MemoryRouter} />
  );

  const heading = screen.getByRole('heading', { name: /login/i });
  expect(heading).toBeInTheDocument();
});

test('navigates to home page', () => {
  render(
    <MemoryRouter initialEntries={['/home']}>
      <Routes>
        <Route path="/home" element={<MainPage />} />
      </Routes>
    </MemoryRouter>
  );

  const heading = screen.getByRole('heading', { name: /welcome to the home page/i });
  expect(heading).toBeInTheDocument();
});
