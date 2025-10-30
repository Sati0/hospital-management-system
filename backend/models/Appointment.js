const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  receiptNumber: {
    type: String,
    unique: true
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate receipt number before saving
appointmentSchema.pre('save', function(next) {
  if (!this.receiptNumber) {
    this.receiptNumber = 'REC' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
