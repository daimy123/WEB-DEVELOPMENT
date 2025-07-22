import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import FilmGrid from "./components/FilmGrid";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./admin/AdminDashboard";
import BookingPage from "./components/BookingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

const AppContent = () => {
  const [activeGenre, setActiveGenre] = useState("All");
  const { currentUser, isAdmin } = useAuth();

  const handleGenreChange = (genre) => {
    setActiveGenre(genre);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="w-full px-6 py-4">
        <Header
          onGenreChange={handleGenreChange}
          activeGenre={activeGenre}
          isLoggedIn={!!currentUser}
          isAdmin={isAdmin()}
          username={currentUser?.username}
        />
        <Routes>
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/register"
            element={currentUser ? <Navigate to="/home" /> : <Register />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-test" element={<AdminDashboard />} />
          <Route
            path="/booking/:filmId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <main className="w-full">
                  <FilmGrid
                    activeGenre={activeGenre}
                    onGenreChange={handleGenreChange}
                  />
                </main>
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
