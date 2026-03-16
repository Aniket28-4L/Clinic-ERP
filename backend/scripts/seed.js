/* eslint-disable no-console */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { loadEnv } = require("../src/config/env");
const { connectMongo } = require("../src/config/db");
const { User } = require("../src/modules/users/user.model");
const { Doctor } = require("../src/modules/doctors/doctor.model");
const { Patient } = require("../src/modules/patients/patient.model");
const { Medicine } = require("../src/modules/pharmacy/medicine.model");
const { Appointment } = require("../src/modules/appointments/appointment.model");

async function seed() {
  const env = loadEnv();
  await connectMongo(env.MONGODB_URI);

  console.log("Connected to MongoDB, seeding sample data...");

  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  let admin = await User.findOne({ email: "admin@clinic.com" });
  if (!admin) {
    admin = await User.create({
      name: "System Admin",
      email: "admin@clinic.com",
      role: "admin",
      password: passwordHash,
      isActive: true,
    });
  }

  const doctorUserPassword = await bcrypt.hash("Doctor@12345", 12);
  let doctorUser = await User.findOne({ email: "doctor@clinic.com" });
  if (!doctorUser) {
    doctorUser = await User.create({
      name: "Dr. John Doe",
      email: "doctor@clinic.com",
      role: "doctor",
      password: doctorUserPassword,
      isActive: true,
    });
  }

  const receptionistPassword = await bcrypt.hash("Reception@12345", 12);
  let receptionistUser = await User.findOne({ email: "receptionist@clinic.com" });
  if (!receptionistUser) {
    receptionistUser = await User.create({
      name: "Front Desk",
      email: "receptionist@clinic.com",
      role: "receptionist",
      password: receptionistPassword,
      isActive: true,
    });
  }

  const pharmacistPassword = await bcrypt.hash("Pharmacy@12345", 12);
  let pharmacistUser = await User.findOne({ email: "pharmacist@clinic.com" });
  if (!pharmacistUser) {
    pharmacistUser = await User.create({
      name: "Pharmacy Staff",
      email: "pharmacist@clinic.com",
      role: "pharmacist",
      password: pharmacistPassword,
      isActive: true,
    });
  }

  let doctor = await Doctor.findOne({ userId: doctorUser._id });
  if (!doctor) {
    doctor = await Doctor.create({
      userId: doctorUser._id,
      specialization: "General Medicine",
      experienceYears: 5,
      consultationFee: 500,
      roomNumber: "101",
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      availableTimeStart: "09:00",
      availableTimeEnd: "17:00",
    });
  }

  const patientsCount = await Patient.countDocuments();
  if (patientsCount === 0) {
    await Patient.insertMany([
      {
        firstName: "Alice",
        lastName: "Johnson",
        gender: "Female",
        age: 32,
        phone: "1234567890",
        address: "City A, Country",
        bloodGroup: "A+",
      },
      {
        firstName: "Bob",
        lastName: "Smith",
        gender: "Male",
        age: 45,
        phone: "9876543210",
        address: "City B, Country",
        bloodGroup: "O+",
      },
    ]);
  }

  const medicinesCount = await Medicine.countDocuments();
  if (medicinesCount === 0) {
    await Medicine.insertMany([
      {
        name: "Paracetamol 500mg",
        manufacturer: "Acme Pharma",
        category: "Analgesic",
        price: 10,
        stockQuantity: 100,
        reorderLevel: 20,
      },
      {
        name: "Amoxicillin 250mg",
        manufacturer: "HealthCorp",
        category: "Antibiotic",
        price: 25,
        stockQuantity: 50,
        reorderLevel: 15,
      },
    ]);
  }

  const patient = await Patient.findOne();
  if (patient) {
    const existingAppointments = await Appointment.countDocuments({ doctorId: doctor._id, patientId: patient._id });
    if (existingAppointments === 0) {
      const now = new Date();
      await Appointment.create({
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentDate: now,
        appointmentTime: "10:00",
        status: "scheduled",
        reason: "General check-up",
      });
    }
  }

  console.log("Seed data created/ensured.");
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("Seed error", err);
  process.exit(1);
});

