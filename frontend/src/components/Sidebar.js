import React from 'react';

function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'personal', label: 'Personal Details', icon: '👤' },
    { id: 'search', label: 'Search Doctor', icon: '🔍' },
    { id: 'status', label: 'Appointment Status', icon: '📋' },
    { id: 'previous', label: 'Previous Appointments', icon: '📅' }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
