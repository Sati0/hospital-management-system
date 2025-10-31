import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PreviousAppointments({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = 'http://localhost:5000';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/appointments/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter for completed and cancelled appointments
      const pastAppointments = response.data.filter(
        apt => apt.status === 'completed' || apt.status === 'cancelled'
      );
      setAppointments(pastAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading previous appointments...</div>;
  }

  return (
    <div>
      <h2>Previous Appointments</h2>
      
      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>No previous appointments</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((apt) => (
            <div key={apt._id} className="appointment-item">
              <div className="appointment-header">
                <h3>{apt.doctor?.user?.name || 'Doctor'}</h3>
                <span className={`status-badge status-${apt.status}`}>
                  {apt.status}
                </span>
              </div>
              <div className="appointment-details">
                <p><strong>Specialization:</strong> {apt.doctor?.specialization}</p>
                <p><strong>Date:</strong> {new Date(apt.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {apt.timeSlot}</p>
                <p><strong>Reason:</strong> {apt.reason}</p>
                <p><strong>Fees:</strong> ₹{apt.doctor?.feesPerSession}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PreviousAppointments;
