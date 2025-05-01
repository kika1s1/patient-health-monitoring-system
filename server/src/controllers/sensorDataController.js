import VitalRecord from '../models/VitalRecord.js';
import User from '../models/User.js';

export const processBluetoothData = async (req, res, next) => {
  const { patientId, deviceId, timestamp: batchTimestamp, readings } = req.body;

  try {
    // Validate patientId
    if (!patientId) {
      return res.status(400).json({ error: 'BadRequest', message: 'Patient ID is required.' });
    }

    const patientUser = await User.findById(patientId);
    if (!patientUser) {
      return res.status(404).json({ error: 'NotFound', message: 'Patient not found.' });
    }
    // Optionally, check if patientUser.role is 'patient' if your system requires it.

    // Validate readings
    if (!Array.isArray(readings) || readings.length === 0) {
      return res.status(400).json({ error: 'BadRequest', message: 'Readings array is required and cannot be empty.' });
    }

    const newVitalRecords = [];
    const allowedVitalTypes = VitalRecord.schema.path('type').enumValues;

    for (const reading of readings) {
      if (!reading.type || reading.value === undefined || reading.value === null) {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'Each reading must have a type and a value.',
          details: { problematicReading: reading },
        });
      }

      if (!allowedVitalTypes.includes(reading.type)) {
        return res.status(400).json({
          error: 'BadRequest',
          message: `Invalid reading type: ${reading.type}. Allowed types are: ${allowedVitalTypes.join(', ')}.`,
          details: { problematicReading: reading },
        });
      }

      // Optional: Light validation on value based on type
      if (reading.type === 'heartRate' && (typeof reading.value !== 'number' || reading.value < 0 || reading.value > 300)) {
        return res.status(400).json({ error: 'BadRequest', message: 'Invalid heart rate value.', details: { problematicReading: reading } });
      }
      if (reading.type === 'oxygenSaturation' && (typeof reading.value !== 'number' || reading.value < 0 || reading.value > 100)) {
        return res.status(400).json({ error: 'BadRequest', message: 'Invalid oxygen saturation value.', details: { problematicReading: reading } });
      }
      if (reading.type === 'temperature' && (typeof reading.value !== 'number' || reading.value < 20 || reading.value > 50)) { // Assuming Celsius
        return res.status(400).json({ error: 'BadRequest', message: 'Invalid temperature value.', details: { problematicReading: reading } });
      }
      // Add more type-specific validations as needed, e.g., for bloodPressure (object with systolic/diastolic)

      const vitalData = {
        patientId: patientId,
        type: reading.type,
        value: reading.value,
        unit: reading.unit, // Will be undefined if not provided, which is fine
        timestamp: reading.timestamp || batchTimestamp, // Defaults to Date.now in schema if both are undefined
        recordedBy: deviceId || 'bluetooth_gateway',
      };

      newVitalRecords.push(vitalData); // Add data object, not Mongoose instance yet
    }

    // If all readings are validated, insert them
    if (newVitalRecords.length > 0) {
      const savedRecords = await VitalRecord.insertMany(newVitalRecords);
      return res.status(201).json({
        message: `${savedRecords.length} vital records saved successfully.`,
        recordsSaved: savedRecords.length,
        data: savedRecords, // Optionally return the saved records
      });
    } else {
      // This case should ideally not be reached if readings array validation is correct
      return res.status(400).json({ error: 'BadRequest', message: 'No valid readings to save.' });
    }

  } catch (error) {
    // Pass to global error handler
    // The global error handler will catch Mongoose validation errors from insertMany
    // or other unexpected errors.
    next(error);
  }
};
