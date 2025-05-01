import mongoose from 'mongoose';

const vitalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient', // Reference to the Patient model
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['ecg', 'heartRate', 'bloodPressure', 'temperature', 'oxygenSaturation'],
    },
    value: {
      type: mongoose.Schema.Types.Mixed, // Can be a simple number or a complex object (e.g., for ECG)
      required: true,
    },
    unit: {
      type: String,
      trim: true, // e.g., 'bpm', 'mmHg', '°C', '%'
    },
    timestamp: {
      type: Date,
      default: Date.now, // Default to current time if not provided
    },
    recordedBy: {
      // Could be a User ID (doctor, patient themselves) or a device identifier
      type: String, // Using String to accommodate various ID types
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Indexing for common query patterns
vitalRecordSchema.index({ patientId: 1 });
vitalRecordSchema.index({ patientId: 1, type: 1 });
vitalRecordSchema.index({ patientId: 1, timestamp: 1 });
vitalRecordSchema.index({ patientId: 1, type: 1, timestamp: 1 });

const VitalRecord = mongoose.model('VitalRecord', vitalRecordSchema);

export default VitalRecord;
