const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   GET /api/doctors
// @desc    Get all doctors with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { specialization, search, minFees, maxFees } = req.query;
    
    let query = { isAvailable: true };
    
    if (specialization) {
      query.specialization = specialization;
    }
    
    if (minFees || maxFees) {
      query.feesPerSession = {};
      if (minFees) query.feesPerSession.$gte = Number(minFees);
      if (maxFees) query.feesPerSession.$lte = Number(maxFees);
    }

    let doctors = await Doctor.find(query)
      .populate('user', 'name email phone profileImage')
      .sort({ rating: -1 });

    // Search by name
    if (search) {
      doctors = doctors.filter(doctor => 
        doctor.user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone profileImage');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/doctors/specializations/list
// @desc    Get list of all specializations
// @access  Public
router.get('/specializations/list', async (req, res) => {
  try {
    const specializations = [
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
    ];
    
    res.json({ specializations });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
