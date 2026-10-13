import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatBot from './components/AIChatBot';
import Home from './pages/Home';
import StudentDetails from './pages/StudentDetails';
import Dashboard from './pages/Dashboard';
import Foods from './pages/Foods';
import Recommendations from './pages/Recommendations';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/student" element={<StudentDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/foods" element={<Foods />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <AIChatBot />
      </div>
    </AuthProvider>
  );
}
