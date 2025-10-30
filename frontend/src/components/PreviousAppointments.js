import React, { useState, useEffect } from 'react';

function PreviousAppointments({ apiUrl }) {
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
      
      // Filter completed or cancelled appointments
      const pastAppointments = (data.appointments || []).filter(
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
    return <div className="content-card">Loading...</div>;
  }

  return (
    <div className="content-card">
      <h2>Previous Appointments</h2>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <p>No previous appointments</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appointment => {
            // Safe check for doctor data
            const doctorName = appointment.doctor?.user?.name || 'Unknown Doctor';
            const specialization = appointment.doctor?.specialization || 'N/A';
            
            return (
              <div key={appointment._id} className="appointment-item history">
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
                  <p><strong>Receipt:</strong> {appointment.receiptNumber}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PreviousAppointments;
