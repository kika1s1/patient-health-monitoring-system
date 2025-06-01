import mongoose, { Schema, Types } from 'mongoose';

const TimeSeriesSchema = new Schema({
  timestamp: { type: Date, required: true },
  value: { type: Number, required: true }
}, { _id: false });

const VitalsMetricSchema = new Schema({
  current: { type: Number, required: true },
  unit: { type: String, required: true },
  status: { type: String, enum: ['normal', 'warning', 'critical'], required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  history: { type: [TimeSeriesSchema], required: true }
}, { _id: false });

const ECGSchema = new Schema({
  history: {
    type: [[Number]], // 2D array for ECG waveform data
    required: true
  },
  status: {
    type: String,
    enum: ['normal', 'warning', 'critical'],
    required: true
  }
}, { _id: false });

const PatientVitalsSchema = new Schema({
  patientId: {
    type: Types.ObjectId,
    ref: 'Patient', // assuming there’s a Patient model
    required: true,
    index: true
  },
  temperature: VitalsMetricSchema,
  oxygenLevel: VitalsMetricSchema,
  pulse: VitalsMetricSchema,
  respirationRate: VitalsMetricSchema,
  ecg: ECGSchema
}, {
  timestamps: true
});

export default mongoose.model('PatientVitals', PatientVitalsSchema);
