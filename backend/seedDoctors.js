const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const doctorsData = [
  // CARDIOLOGY - 5 doctors
  { name: 'Dr. Rahul Mehta', spec: 'cardiology', exp: 20, fees: 2000, qual: 'MBBS, MD (Cardiology)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Sanjay Gupta', spec: 'cardiology', exp: 18, fees: 1800, qual: 'MBBS, DM (Cardiology)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Kavita Reddy', spec: 'cardiology', exp: 15, fees: 1700, qual: 'MBBS, MD (Cardiology)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Arun Sharma', spec: 'cardiology', exp: 22, fees: 2200, qual: 'MBBS, DNB (Cardiology)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Meera Iyer', spec: 'cardiology', exp: 16, fees: 1600, qual: 'MBBS, MD (Cardiology)', avail: ['Monday', 'Wednesday', 'Friday'] },

  // NEUROLOGY - 5 doctors
  { name: 'Dr. Ashok Krishnan', spec: 'neurology', exp: 17, fees: 1600, qual: 'MBBS, MD (Neurology)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Lakshmi Pillai', spec: 'neurology', exp: 15, fees: 1500, qual: 'MBBS, DM (Neurology)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Shweta Bansal', spec: 'neurology', exp: 11, fees: 1300, qual: 'MBBS, MD (Neurology)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Rajiv Malhotra', spec: 'neurology', exp: 19, fees: 1900, qual: 'MBBS, DNB (Neurology)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Neha Kapoor', spec: 'neurology', exp: 13, fees: 1400, qual: 'MBBS, MD (Neurology)', avail: ['Tuesday', 'Thursday', 'Saturday'] },

  // DENTIST - 5 doctors
  { name: 'Dr. Naveen Kumar', spec: 'dentist', exp: 7, fees: 700, qual: 'BDS, MDS (Orthodontics)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Pooja Nair', spec: 'dentist', exp: 9, fees: 800, qual: 'BDS, MDS (Prosthodontics)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Vikram Singh', spec: 'dentist', exp: 12, fees: 900, qual: 'BDS, MDS (Oral Surgery)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Anjali Verma', spec: 'dentist', exp: 6, fees: 650, qual: 'BDS', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Rohan Das', spec: 'dentist', exp: 10, fees: 850, qual: 'BDS, MDS (Periodontics)', avail: ['Monday', 'Wednesday', 'Friday'] },

  // DERMATOLOGY - 5 doctors
  { name: 'Dr. Priya Sharma', spec: 'dermatology', exp: 12, fees: 1200, qual: 'MBBS, MD (Dermatology)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Suresh Menon', spec: 'dermatology', exp: 14, fees: 1300, qual: 'MBBS, DNB (Dermatology)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Deepa Rao', spec: 'dermatology', exp: 10, fees: 1100, qual: 'MBBS, MD (Dermatology)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Arjun Patel', spec: 'dermatology', exp: 15, fees: 1400, qual: 'MBBS, MD (Dermatology)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Swati Deshmukh', spec: 'dermatology', exp: 8, fees: 1000, qual: 'MBBS, MD (Dermatology)', avail: ['Tuesday', 'Thursday', 'Saturday'] },

  // ORTHOPEDICS - 5 doctors
  { name: 'Dr. Amit Singh', spec: 'orthopedics', exp: 18, fees: 1800, qual: 'MBBS, MS (Orthopedics)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Ramesh Kumar', spec: 'orthopedics', exp: 20, fees: 2000, qual: 'MBBS, DNB (Orthopedics)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Sunita Joshi', spec: 'orthopedics', exp: 16, fees: 1700, qual: 'MBBS, MS (Orthopedics)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Prakash Yadav', spec: 'orthopedics', exp: 14, fees: 1500, qual: 'MBBS, MS (Orthopedics)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Ritu Agarwal', spec: 'orthopedics', exp: 12, fees: 1400, qual: 'MBBS, DNB (Orthopedics)', avail: ['Monday', 'Wednesday', 'Friday'] },

  // PEDIATRICS - 5 doctors
  { name: 'Dr. Sneha Patel', spec: 'pediatrics', exp: 10, fees: 1000, qual: 'MBBS, MD (Pediatrics)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Manish Khanna', spec: 'pediatrics', exp: 13, fees: 1200, qual: 'MBBS, DNB (Pediatrics)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Nisha Bhatt', spec: 'pediatrics', exp: 9, fees: 950, qual: 'MBBS, MD (Pediatrics)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Kiran Bose', spec: 'pediatrics', exp: 15, fees: 1300, qual: 'MBBS, MD (Pediatrics)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Vivek Saxena', spec: 'pediatrics', exp: 11, fees: 1100, qual: 'MBBS, MD (Pediatrics)', avail: ['Tuesday', 'Thursday', 'Saturday'] },

  // GENERAL PRACTICE - 5 doctors
  { name: 'Dr. Rajesh Kumar', spec: 'general_practice', exp: 8, fees: 800, qual: 'MBBS', avail: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  { name: 'Dr. Seema Mishra', spec: 'general_practice', exp: 10, fees: 900, qual: 'MBBS', avail: ['Monday', 'Wednesday', 'Friday', 'Saturday'] },
  { name: 'Dr. Harish Chand', spec: 'general_practice', exp: 12, fees: 1000, qual: 'MBBS, MD', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Rekha Devi', spec: 'general_practice', exp: 7, fees: 750, qual: 'MBBS', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Sanjiv Chopra', spec: 'general_practice', exp: 15, fees: 1200, qual: 'MBBS, MD', avail: ['Tuesday', 'Thursday', 'Saturday'] },

  // GYNECOLOGY - 5 doctors
  { name: 'Dr. Anita Desai', spec: 'gynecology', exp: 14, fees: 1400, qual: 'MBBS, MD (OB/GYN)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Kavya Reddy', spec: 'gynecology', exp: 16, fees: 1600, qual: 'MBBS, DGO', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Shruti Nambiar', spec: 'gynecology', exp: 12, fees: 1300, qual: 'MBBS, MD (OB/GYN)', avail: ['Monday', 'Wednesday', 'Friday'] },
  { name: 'Dr. Radha Krishnan', spec: 'gynecology', exp: 18, fees: 1700, qual: 'MBBS, DNB (OB/GYN)', avail: ['Tuesday', 'Thursday', 'Saturday'] },
  { name: 'Dr. Geeta Srinivasan', spec: 'gynecology', exp: 10, fees: 1200, qual: 'MBBS, MD (OB/GYN)', avail: ['Monday', 'Wednesday', 'Friday'] }
];

async function seedDoctors() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital';
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Doctor.deleteMany({});
    await User.deleteMany({ role: 'doctor' });
    console.log('🗑️  Cleared existing doctors');

    let count = 0;
    for (const doc of doctorsData) {
      // Create user account
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      const email = doc.name.toLowerCase().replace(/\s+/g, '.').replace('dr.', '') + '@hospital.com';
      
      const user = new User({
        name: doc.name,
        email: email,
        password: hashedPassword,
        phone: `98765${String(43210 + count).padStart(5, '0')}`,
        role: 'doctor'
      });
      await user.save();

      // Create doctor profile with all required fields
      const doctor = new Doctor({
        user: user._id,               // ✅ REQUIRED
        specialization: doc.spec,
        qualification: doc.qual,       // ✅ REQUIRED
        experience: doc.exp,
        feesPerSession: doc.fees,      // ✅ REQUIRED (not 'fees')
        availability: doc.avail
      });
      await doctor.save();
      
      count++;
    }

    console.log(`✅ ${count} doctors seeded successfully\n`);

    // Display summary
    const specs = [...new Set(doctorsData.map(d => d.spec))];
    console.log('🏥 Doctors by Specialization:\n');
    for (const spec of specs) {
      const specDoctors = doctorsData.filter(d => d.spec === spec);
      console.log(`📌 ${spec.toUpperCase()} (${specDoctors.length} doctors)`);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();
