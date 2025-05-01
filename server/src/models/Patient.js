import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    // Name can be derived from User model, but keeping it here for flexibility
    // If it's always the same as User, consider removing and populating from User
    name: {
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
    },
    // Consider adding other fields as per BACKEND_API_DOCUMENTATION.MD if more details are there
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
