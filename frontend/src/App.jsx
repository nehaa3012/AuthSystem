import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:8000/api/user/checkAuth", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.log("Not authenticated");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>; // Show loading state
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Public Route component (for login/register when already authenticated)
  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return isAuthenticated ? <Navigate to="/" replace /> : children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      )
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login onLogin={() => setIsAuthenticated(true)} />
        </PublicRoute>
      )
    },
    {
      path: "/register",
      element: (
        <PublicRoute>
          <Register onRegister={() => setIsAuthenticated(true)} />
        </PublicRoute>
      )
    },
    {
      path: "*",
      element: <div>404 - Page Not Found</div>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;