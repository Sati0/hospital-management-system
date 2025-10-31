import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SearchDoctor({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('09:00');
  const [reason, setReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const apiUrl = 'http://localhost:5000';

  const searchDoctors = async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (searchName) params.append('name', searchName);
      if (specialization && specialization !== '') params.append('specialization', specialization);
      
      const response = await axios.get(`${apiUrl}/api/doctors?${params.toString()}`);
      setDoctors(response.data);
      
      if (response.data.length === 0) {
        setError('No doctors found');
      }
    } catch (err) {
      console.error('Error searching doctors:', err);
      setError('Error searching doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchDoctors();
  }, []);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setAppointmentDate(tomorrow.toISOString().split('T')[0]);
  };

  const confirmBooking = async () => {
    if (!appointmentDate || !appointmentTime || !reason.trim()) {
      alert('Please fill all fields');
      return;
    }

    setBookingLoading(true);
    try {
      console.log('Booking with:', {
        doctorId: selectedDoctor._id,
        patientId: user.id,
        date: appointmentDate,
        timeSlot: appointmentTime,
        reason: reason
      });

      const response = await axios.post(`${apiUrl}/api/appointments`, {
        doctorId: selectedDoctor._id,
        patientId: user.id,
        date: appointmentDate,
        timeSlot: appointmentTime,
        reason: reason
      });

      alert('Appointment booked successfully!');
      setShowModal(false);
      setReason('');
      setAppointmentDate('');
      setAppointmentTime('09:00');
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.message || 'Error booking appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Doctor</h2>
      
      <div className="search-form">
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All Specializations</option>
          <option value="cardiology">Cardiology</option>
          <option value="neurology">Neurology</option>
          <option value="dentist">Dentist</option>
          <option value="dermatology">Dermatology</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="general_practice">General Practice</option>
          <option value="gynecology">Gynecology</option>
        </select>
        <button onClick={searchDoctors} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p style={{color: 'red'}}>{error}</p>}

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="doctor-card">
            <h3>{doctor.user?.name || 'Doctor'}</h3>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Qualification:</strong> {doctor.qualification}</p>
            <p><strong>Experience:</strong> {doctor.experience} years</p>
            <p><strong>Fees:</strong> ₹{doctor.feesPerSession}</p>
            <p><strong>Availability:</strong> {doctor.availability.join(', ')}</p>
            <button onClick={() => handleBookAppointment(doctor)}>
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Book Appointment with {selectedDoctor?.user?.name}</h3>
            
            <label>Date:</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />

            <label>Time Slot:</label>
            <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)}>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
            </select>

            <label>Reason for Visit:</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your symptoms..."
              rows="4"
            />

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={confirmBooking} disabled={bookingLoading}>
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchDoctor;
