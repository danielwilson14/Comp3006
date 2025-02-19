import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavigationBar from './components/NavigationBar.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Home from './pages/MainPage.js';
import AddWorkout from './pages/AddWorkout.js';
import ViewWorkouts from './pages/ViewWorkouts.js';
import WorkoutStats from './pages/WorkoutStats.js';
import UpdateProfile from './pages/UpdateProfile.js';

const App = ({ RouterProvider = BrowserRouter }) => {
  return (
    <RouterProvider>
      <ConditionalNavigationBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-workout" element={<AddWorkout />} />
        <Route path="/view-workouts" element={<ViewWorkouts />} />
        <Route path="/workout-stats" element={<WorkoutStats />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
      </Routes>
    </RouterProvider>
  );
};

export default App;

const ConditionalNavigationBar = () => {
  const location = useLocation();
  const excludedPaths = ['/login', '/register'];
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }

  return <NavigationBar />;
};
