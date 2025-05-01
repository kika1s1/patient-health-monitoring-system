import VitalRecord from '../models/VitalRecord.js';
import Patient from '../models/Patient.js'; // To validate patientId and for authorization

// @desc    Get vital records for a specific patient
// @route   GET /api/v1/patients/:patientId/vitals
// @access  Private (Patient, authorized Doctor, Admin)
export const getVitalsForPatient = async (req, res) => {
  const { patientId } = req.params;
  const { type, startDate, endDate, page = 1, limit = 10 } = req.query;
  const loggedInUser = req.user;

  try {
    // Validate patientId
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Authorization:
    // 1. Patient can view their own vitals.
    // 2. Doctor can view any patient's vitals (in a real-world scenario, this might be restricted to patients under their care).
    // 3. Admin can view any patient's vitals.
    if (
      loggedInUser.role === 'patient' &&
      patient.userId.toString() !== loggedInUser._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view these vitals.' });
    }
    // Doctors and Admins have access based on role (already protected by `protect` and potentially `authorize` on route)

    const query = { patientId };
    if (type) {
      query.type = type;
    }
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    const vitals = await VitalRecord.find(query)
      .sort({ timestamp: -1 }) // Sort by most recent first
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await VitalRecord.countDocuments(query);

    res.json({
      vitals,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalRecords: count,
    });
  } catch (error) {
    console.error('Get Vitals Error:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Patient not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error fetching vital records.' });
  }
};

// @desc    Add a new vital record for a specific patient
// @route   POST /api/v1/patients/:patientId/vitals
// @access  Private (Patient, Doctor, Admin - or trusted device/system)
export const addVitalForPatient = async (req, res) => {
  const { patientId } = req.params;
  const { type, value, unit, timestamp, recordedBy: providedRecordedBy } = req.body;
  const loggedInUser = req.user;

  try {
    // Validate patientId
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Authorization:
    // 1. Patient can add their own vitals.
    // 2. Doctor can add vitals for any patient.
    // 3. Admin can add vitals.
    // (A trusted device might have its own authentication mechanism not covered here)
    if (
      loggedInUser.role === 'patient' &&
      patient.userId.toString() !== loggedInUser._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to add vitals for this patient.' });
    }

    // Validate required fields for vital record
    if (!type || value === undefined || value === null) {
      return res.status(400).json({ message: 'Type and value are required for vital records.' });
    }

    // Determine `recordedBy`. If not explicitly provided in the request,
    // and a user is making the request, default to the logged-in user's ID.
    // For a device, `recordedBy` would be set in the request body.
    const recordedBy = providedRecordedBy || loggedInUser._id.toString();

    const newVital = new VitalRecord({
      patientId,
      type,
      value,
      unit,
      timestamp, // Defaults to Date.now if not provided
      recordedBy,
    });

    const savedVital = await newVital.save();
    res.status(201).json(savedVital);
  } catch (error) {
    console.error('Add Vital Error:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Patient not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error adding vital record.' });
  }
};
