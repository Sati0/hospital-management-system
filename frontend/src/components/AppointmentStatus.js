import React, { useState, useEffect } from 'react';

function AppointmentStatus({ apiUrl }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      // Filter only upcoming/pending appointments
      const upcomingAppointments = (data.appointments || []).filter(
        apt => apt.status !== 'completed' && apt.status !== 'cancelled'
      );
      
      setAppointments(upcomingAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/appointments/${appointmentId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ Appointment cancelled successfully');
        fetchAppointments();
      } else {
        alert('❌ Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('❌ Error cancelling appointment');
    }
  };

  if (loading) {
    return <div className="content-card">Loading...</div>;
  }

  return (
    <div className="content-card">
      <h2>Appointment Status</h2>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>No upcoming appointments</p>
          <p>Book an appointment from the Search Doctor page</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => {
            // Safe check for doctor data
            const doctorName = appointment.doctor?.user?.name || 'Unknown Doctor';
            const specialization = appointment.doctor?.specialization || 'N/A';
            
            return (
              <div key={appointment._id} className="appointment-item">
                <div className="appointment-header">
                  <h3>Dr. {doctorName}</h3>
                  <span className={`status-badge status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
                
                <div className="appointment-details">
                  <p><strong>Specialization:</strong> {specialization}</p>
                  <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appointment.timeSlot}</p>
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                  <p><strong>Fee:</strong> ₹{appointment.amount}</p>
                </div>

                {appointment.status === 'pending' && (
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancel(appointment._id)}
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AppointmentStatus;
