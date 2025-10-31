import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AppointmentStatus({ user }) {
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
      
      // Filter for pending and confirmed appointments only
      const activeAppointments = response.data.filter(
        apt => apt.status === 'pending' || apt.status === 'confirmed'
      );
      setAppointments(activeAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${apiUrl}/api/appointments/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error cancelling appointment');
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div>
      <h2>Appointment Status</h2>
      
      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>No active appointments</p>
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
              {apt.status === 'pending' && (
                <button 
                  className="cancel-btn"
                  onClick={() => cancelAppointment(apt._id)}
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentStatus;
