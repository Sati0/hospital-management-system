import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import PersonalDetails from './components/PersonalDetails';
import SearchDoctor from './components/SearchDoctor';
import AppointmentStatus from './components/AppointmentStatus';
import PreviousAppointments from './components/PreviousAppointments';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('personal');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} apiUrl={API_URL} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-left">
          <div className="logo">🏥</div>
          <h1>Hospital Management System</h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="app-container">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        
        <main className="main-content">
          {currentPage === 'personal' && <PersonalDetails user={user} />}
          {currentPage === 'search' && <SearchDoctor apiUrl={API_URL} />}
          {currentPage === 'status' && <AppointmentStatus apiUrl={API_URL} />}
          {currentPage === 'previous' && <PreviousAppointments apiUrl={API_URL} />}
        </main>
      </div>
    </div>
  );
}

export default App;
