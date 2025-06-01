import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    contactInfo: {
      phone: {
        type: String,
        trim: true,
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
    medicalHistorySummary: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['normal', 'warning', 'critical'],
      default: 'normal',
    },
    location: {
      address: String, // e.g., "123 Main St, Springfield, IL, USA" or specific facility name
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
      inHospital: {
        type: Boolean,
        default: false,
      },
      age: {
        type: Number,
        min: 0, // Ensures age is a non-negative number
      },
      additionalInfo: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Indexing common query fields
patientSchema.index({ name: 'text', 'contactInfo.phone': 1 });
patientSchema.index({ status: 1 });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
