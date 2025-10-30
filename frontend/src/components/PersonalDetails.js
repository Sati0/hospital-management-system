import React from 'react';

function PersonalDetails({ user }) {
  if (!user) return <div>Loading...</div>;

  return (
    <div className="content-card">
      <h2>Personal Details</h2>
      
      <div className="personal-info">
        <div className="profile-image">
          <img src={user.profileImage} alt={user.name} />
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Name:</label>
            <span>{user.name}</span>
          </div>

          <div className="info-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>

          <div className="info-item">
            <label>Phone:</label>
            <span>{user.phone}</span>
          </div>

          <div className="info-item">
            <label>Role:</label>
            <span className="role-badge">{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetails;
