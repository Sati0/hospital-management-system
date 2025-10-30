import React, { useState, useEffect } from 'react';

function SearchDoctor({ apiUrl }) {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '09:00:00',
    reason: ''
  });

  const timeSlots = ['09:00:00', '12:00:00', '15:00:00'];

  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let url = `${apiUrl}/api/doctors?`;
      if (search) url += `search=${search}&`;
      if (specialization) url += `specialization=${specialization}`;

      const response = await fetch(url);
      const data = await response.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBooking(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          appointmentDate: bookingData.date,
          timeSlot: bookingData.timeSlot,
          reason: bookingData.reason
        })
      });

      if (response.ok) {
        alert('✅ Appointment booked successfully!');
        setShowBooking(false);
        setBookingData({ date: '', timeSlot: '09:00:00', reason: '' });
      } else {
        const data = await response.json();
        alert('❌ ' + data.message);
      }
    } catch (error) {
      alert('❌ Failed to book appointment');
      console.error('Booking error:', error);
    }
  };

  return (
    <div className="content-card">
      <h2>Search Doctor</h2>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="">All Specializations</option>
          <option value="cardiology">Cardiology</option>
          <option value="dermatology">Dermatology</option>
          <option value="general practice">General Practice</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="surgery">Surgery</option>
        </select>

        <button type="submit" className="search-btn">Search</button>
      </form>

      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        <div className="doctors-grid">
          {doctors.map(doctor => (
            <div key={doctor._id} className="doctor-card">
              <h3>{doctor.user.name}</h3>
              <p><strong>Specialization:</strong> {doctor.specialization}</p>
              <p><strong>Experience:</strong> {doctor.experience} years</p>
              <p><strong>Fees:</strong> ₹{doctor.feesPerSession}</p>
              <button 
                className="book-btn"
                onClick={() => handleBookAppointment(doctor)}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {showBooking && (
        <div className="modal-overlay" onClick={() => setShowBooking(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Book Appointment with Dr. {selectedDoctor.user.name}</h3>
            <form onSubmit={handleBookingSubmit}>
              <label>Date:</label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <label>Time Slot:</label>
              <select
                value={bookingData.timeSlot}
                onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>

              <label>Reason for Visit:</label>
              <textarea
                value={bookingData.reason}
                onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                placeholder="Describe your symptoms..."
                required
              />

              <div className="modal-actions">
                <button type="submit" className="submit-btn">Confirm Booking</button>
                <button type="button" onClick={() => setShowBooking(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchDoctor;
