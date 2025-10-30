const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: true,
    enum: [
      'cardiology',
      'dermatology',
      'emergency medicine',
      'general practice',
      'intensive care medicine',
      'neurology',
      'obstetrics',
      'pathology',
      'pediatrics',
      'psychiatry',
      'surgery',
      'anesthesia',
      'dentist',
      'pain medicine'
    ]
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  feesPerSession: {
    type: Number,
    required: true
  },
  availableSlots: [{
    day: String,
    slots: [String]
  }],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
