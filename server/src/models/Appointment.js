import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // User who is the patient
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // User who is the doctor
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'confirmed', 'cancelled', 'completed'],
      default: 'scheduled',
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Compound indexes
appointmentSchema.index({ patientId: 1, startTime: 1 });
appointmentSchema.index({ doctorId: 1, startTime: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
