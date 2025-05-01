import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Each user should have one doctor profile
    },
    // Name can be derived from User model, but keeping it here for consistency with Patient model
    // and potential flexibility if a doctor's professional name differs.
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
    },
    qualifications: [
      {
        type: String,
        trim: true,
      },
    ],
    yearsOfExperience: {
      type: Number,
      min: 0,
    },
    consultationFee: {
      type: Number,
      min: 0,
    },
    availability: [
      {
        dayOfWeek: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true,
        },
        startTime: { // Store time in HH:mm format or as minutes from start of day
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        isAvailable: { // To easily mark a day as unavailable
          type: Boolean,
          default: true,
        }
      },
    ],
    // Consider adding other fields like clinic address, languages spoken, etc.
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);


const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
