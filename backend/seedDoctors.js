const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const sampleDoctors = [
  // Cardiology - Male doctors
  { name: 'Dr. Rajesh Kumar', email: 'rajesh.cardio@hospital.com', specialization: 'cardiology', qualification: 'MBBS, MD, DM (Cardiology)', experience: 15, fees: 1200, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Dr. Amit Patel', email: 'amit.cardio@hospital.com', specialization: 'cardiology', qualification: 'MBBS, DNB (Cardiology)', experience: 10, fees: 900, image: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { name: 'Dr. Sanjay Mehta', email: 'sanjay.cardio@hospital.com', specialization: 'cardiology', qualification: 'MBBS, MD, FESC', experience: 18, fees: 1500, image: 'https://randomuser.me/api/portraits/men/67.jpg' },
  // Cardiology - Female doctor
  { name: 'Dr. Priya Sharma', email: 'priya.cardio@hospital.com', specialization: 'cardiology', qualification: 'MBBS, MD (Medicine)', experience: 12, fees: 1000, image: 'https://randomuser.me/api/portraits/women/44.jpg' },

  // Dermatology
  { name: 'Dr. Anjali Rao', email: 'anjali.derm@hospital.com', specialization: 'dermatology', qualification: 'MBBS, MD (Dermatology)', experience: 8, fees: 800, image: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Dr. Vikram Singh', email: 'vikram.derm@hospital.com', specialization: 'dermatology', qualification: 'MBBS, DVD', experience: 10, fees: 850, image: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { name: 'Dr. Neha Gupta', email: 'neha.derm@hospital.com', specialization: 'dermatology', qualification: 'MBBS, MD, DDVL', experience: 7, fees: 750, image: 'https://randomuser.me/api/portraits/women/33.jpg' },
  { name: 'Dr. Rohit Desai', email: 'rohit.derm@hospital.com', specialization: 'dermatology', qualification: 'MBBS, MD (Skin)', experience: 12, fees: 950, image: 'https://randomuser.me/api/portraits/men/54.jpg' },

  // General Practice
  { name: 'Dr. Sunita Reddy', email: 'sunita.gp@hospital.com', specialization: 'general practice', qualification: 'MBBS', experience: 5, fees: 500, image: 'https://randomuser.me/api/portraits/women/21.jpg' },
  { name: 'Dr. Arjun Nair', email: 'arjun.gp@hospital.com', specialization: 'general practice', qualification: 'MBBS, DNB', experience: 8, fees: 600, image: 'https://randomuser.me/api/portraits/men/71.jpg' },
  { name: 'Dr. Kavita Joshi', email: 'kavita.gp@hospital.com', specialization: 'general practice', qualification: 'MBBS, MD', experience: 6, fees: 550, image: 'https://randomuser.me/api/portraits/women/55.jpg' },
  { name: 'Dr. Manoj Kumar', email: 'manoj.gp@hospital.com', specialization: 'general practice', qualification: 'MBBS', experience: 10, fees: 700, image: 'https://randomuser.me/api/portraits/men/28.jpg' },

  // Pediatrics
  { name: 'Dr. Pooja Iyer', email: 'pooja.ped@hospital.com', specialization: 'pediatrics', qualification: 'MBBS, MD (Pediatrics)', experience: 9, fees: 800, image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Dr. Ravi Verma', email: 'ravi.ped@hospital.com', specialization: 'pediatrics', qualification: 'MBBS, DCH', experience: 11, fees: 850, image: 'https://randomuser.me/api/portraits/men/41.jpg' },
  { name: 'Dr. Deepa Shah', email: 'deepa.ped@hospital.com', specialization: 'pediatrics', qualification: 'MBBS, MD, FIAP', experience: 13, fees: 950, image: 'https://randomuser.me/api/portraits/women/72.jpg' },
  { name: 'Dr. Anil Kapoor', email: 'anil.ped@hospital.com', specialization: 'pediatrics', qualification: 'MBBS, DNB (Pediatrics)', experience: 7, fees: 750, image: 'https://randomuser.me/api/portraits/men/63.jpg' },

  // Surgery
  { name: 'Dr. Karan Malhotra', email: 'karan.surg@hospital.com', specialization: 'surgery', qualification: 'MBBS, MS (General Surgery)', experience: 16, fees: 1500, image: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { name: 'Dr. Meena Agarwal', email: 'meena.surg@hospital.com', specialization: 'surgery', qualification: 'MBBS, MS, FICS', experience: 14, fees: 1400, image: 'https://randomuser.me/api/portraits/women/47.jpg' },
  { name: 'Dr. Suresh Reddy', email: 'suresh.surg@hospital.com', specialization: 'surgery', qualification: 'MBBS, MS, FRCS', experience: 20, fees: 1800, image: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { name: 'Dr. Divya Menon', email: 'divya.surg@hospital.com', specialization: 'surgery', qualification: 'MBBS, MS (Surgery)', experience: 12, fees: 1300, image: 'https://randomuser.me/api/portraits/women/58.jpg' },

  // Neurology
  { name: 'Dr. Ashok Krishnan', email: 'ashok.neuro@hospital.com', specialization: 'neurology', qualification: 'MBBS, MD, DM (Neurology)', experience: 17, fees: 1600, image: 'https://randomuser.me/api/portraits/men/69.jpg' },
  { name: 'Dr. Lakshmi Pillai', email: 'lakshmi.neuro@hospital.com', specialization: 'neurology', qualification: 'MBBS, MD (Medicine), DM', experience: 15, fees: 1500, image: 'https://randomuser.me/api/portraits/women/62.jpg' },
  { name: 'Dr. Ramesh Chandra', email: 'ramesh.neuro@hospital.com', specialization: 'neurology', qualification: 'MBBS, DNB (Neurology)', experience: 13, fees: 1400, image: 'https://randomuser.me/api/portraits/men/38.jpg' },
  { name: 'Dr. Shweta Bansal', email: 'shweta.neuro@hospital.com', specialization: 'neurology', qualification: 'MBBS, MD, DM (Neuro)', experience: 11, fees: 1300, image: 'https://randomuser.me/api/portraits/women/29.jpg' },

  // Psychiatry
  { name: 'Dr. Varun Saxena', email: 'varun.psych@hospital.com', specialization: 'psychiatry', qualification: 'MBBS, MD (Psychiatry)', experience: 10, fees: 1000, image: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { name: 'Dr. Isha Chopra', email: 'isha.psych@hospital.com', specialization: 'psychiatry', qualification: 'MBBS, DPM', experience: 8, fees: 900, image: 'https://randomuser.me/api/portraits/women/36.jpg' },
  { name: 'Dr. Alok Bhardwaj', email: 'alok.psych@hospital.com', specialization: 'psychiatry', qualification: 'MBBS, MD, DNB', experience: 12, fees: 1100, image: 'https://randomuser.me/api/portraits/men/56.jpg' },
  { name: 'Dr. Shalini Rao', email: 'shalini.psych@hospital.com', specialization: 'psychiatry', qualification: 'MBBS, MD (Psych)', experience: 9, fees: 950, image: 'https://randomuser.me/api/portraits/women/50.jpg' },

  // Dentist
  { name: 'Dr. Naveen Kumar', email: 'naveen.dent@hospital.com', specialization: 'dentist', qualification: 'BDS, MDS', experience: 7, fees: 700, image: 'https://randomuser.me/api/portraits/men/33.jpg' },
  { name: 'Dr. Ritu Singh', email: 'ritu.dent@hospital.com', specialization: 'dentist', qualification: 'BDS, MDS (Orthodontics)', experience: 9, fees: 800, image: 'https://randomuser.me/api/portraits/women/41.jpg' },
  { name: 'Dr. Gaurav Sharma', email: 'gaurav.dent@hospital.com', specialization: 'dentist', qualification: 'BDS, MDS (Prosthodontics)', experience: 11, fees: 850, image: 'https://randomuser.me/api/portraits/men/61.jpg' },
  { name: 'Dr. Anita Deshmukh', email: 'anita.dent@hospital.com', specialization: 'dentist', qualification: 'BDS, MDS', experience: 6, fees: 650, image: 'https://randomuser.me/api/portraits/women/27.jpg' },

  // Emergency Medicine
  { name: 'Dr. Mohit Arora', email: 'mohit.em@hospital.com', specialization: 'emergency medicine', qualification: 'MBBS, MD (Emergency)', experience: 10, fees: 1200, image: 'https://randomuser.me/api/portraits/men/48.jpg' },
  { name: 'Dr. Sapna Jain', email: 'sapna.em@hospital.com', specialization: 'emergency medicine', qualification: 'MBBS, DNB (Emergency)', experience: 8, fees: 1100, image: 'https://randomuser.me/api/portraits/women/39.jpg' },
  { name: 'Dr. Rahul Pandey', email: 'rahul.em@hospital.com', specialization: 'emergency medicine', qualification: 'MBBS, MRCEM', experience: 12, fees: 1300, image: 'https://randomuser.me/api/portraits/men/77.jpg' },
  { name: 'Dr. Nisha Bose', email: 'nisha.em@hospital.com', specialization: 'emergency medicine', qualification: 'MBBS, MD (EM)', experience: 9, fees: 1150, image: 'https://randomuser.me/api/portraits/women/74.jpg' },
];

async function seedDoctors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing doctors
    await User.deleteMany({ role: 'doctor' });
    await Doctor.deleteMany({});
    console.log('🗑️  Cleared existing doctors');

    // Create doctors
    for (const doc of sampleDoctors) {
      // Create user account
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: hashedPassword,
        phone: '1234567890',
        role: 'doctor',
        profileImage: doc.image
      });

      // Create doctor profile
      await Doctor.create({
        user: user._id,
        specialization: doc.specialization,
        qualification: doc.qualification,
        experience: doc.experience,
        feesPerSession: doc.fees,
        isAvailable: true
      });

      console.log(`✅ Created doctor: ${doc.name}`);
    }

    console.log(`\n🎉 Successfully seeded ${sampleDoctors.length} doctors!`);
    console.log('📝 All doctors have password: doctor123');
    console.log('🖼️  Each doctor has a unique profile image');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
}

seedDoctors();
