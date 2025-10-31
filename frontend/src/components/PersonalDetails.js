import React from 'react';

function PersonalDetails({ user }) {
  if (!user) {
    return (
      <div>
        <h2>Personal Details</h2>
        <div className="empty-state">
          <p>No user data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Personal Details</h2>
      <div className="personal-info">
        <div className="profile-image">
          <img 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            alt="Profile" 
          />
        </div>
        <div className="info-grid">
          <div className="info-item">
            <label>Name:</label>
            <span>{user.name || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{user.email || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Phone:</label>
            <span>{user.phone || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Role:</label>
            <span className="role-badge">{user.role || 'patient'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;
