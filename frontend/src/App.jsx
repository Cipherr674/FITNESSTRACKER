import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminRoute from './components/AdminRoute'; // Import the admin route wrapper
import { Toaster } from 'react-hot-toast';

// Import your pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import AdminPanel from './pages/AdminPanel';
import Statistics from './pages/Statistics';

// Import layout components
import Main from "./components/Main";  // This might wrap authenticated pages
import Sidebar from "./components/Sidebar";  // Your new sidebar component
import PredefinedWorkoutForm from './components/PredefinedWorkoutForm';
import WorkoutHistory from './pages/WorkoutHistory';
import LandingPage from './components/LandingPage';


function App() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex">
       
       

        {/* Main Content Area */}
        <div className="flex-grow">
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* For authenticated pages, we wrap them in the Main layout which might include other common components */}
              <Route path="/dashboard" element={<Main child={<Dashboard />} />} />
              <Route path="/leaderboard" element={<Main child={<Leaderboard />} />} />
              <Route path="/profile" element={<Main child={<Profile />} />} />
              <Route path="/prefilled-workout" element={<Main child={<PredefinedWorkoutForm />} />} />
              <Route path="/workout-log" element={<Main child={<WorkoutHistory/>} />} />
              <Route path="/statistics" element={<Main child={<Statistics />} />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
