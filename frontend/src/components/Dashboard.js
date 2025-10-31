import React, { useState } from 'react';
import PersonalDetails from './PersonalDetails';
import SearchDoctor from './SearchDoctor';
import AppointmentStatus from './AppointmentStatus';
import PreviousAppointments from './PreviousAppointments';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <span className="logo">🏥</span>
          <h1>Hospital Management System</h1>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="app-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button
              className={`sidebar-item ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <span className="sidebar-icon">👤</span>
              Personal Details
            </button>
            <button
              className={`sidebar-item ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              <span className="sidebar-icon">🔍</span>
              Search Doctor
            </button>
            <button
              className={`sidebar-item ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveTab('status')}
            >
              <span className="sidebar-icon">📋</span>
              Appointment Status
            </button>
            <button
              className={`sidebar-item ${activeTab === 'previous' ? 'active' : ''}`}
              onClick={() => setActiveTab('previous')}
            >
              <span className="sidebar-icon">📅</span>
              Previous Appointments
            </button>
          </nav>
        </aside>

        <main className="main-content">
          <div className="content-card">
            {activeTab === 'personal' && <PersonalDetails user={user} />}
            {activeTab === 'search' && <SearchDoctor user={user} />}
            {activeTab === 'status' && <AppointmentStatus user={user} />}
            {activeTab === 'previous' && <PreviousAppointments user={user} />}
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
