const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors or filter by specialization
router.get('/', async (req, res) => {
  try {
    const { specialization, name } = req.query;
    
    let query = {};
    
    if (specialization && specialization !== '' && specialization !== 'all') {
      query.specialization = specialization;
    }
    
    if (name && name.trim() !== '') {
      query.name = { $regex: name, $options: 'i' };
    }
    
    const doctors = await Doctor.find(query).populate('user', 'name email phone');
    
    console.log(`Found ${doctors.length} doctors`);
    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});

module.exports = router;
