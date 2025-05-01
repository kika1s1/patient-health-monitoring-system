import Patient from '../models/Patient.js';
import User from '../models/User.js'; // Needed for linking patient to a user

// @desc    Create a new patient profile
// @route   POST /api/v1/patients
// @access  Private (Requires admin or doctor role - to be enforced by authorize middleware in routes)
export const createPatient = async (req, res) => {
  const {
    name,
    dateOfBirth,
    gender,
    contactInfo,
    medicalHistorySummary,
    emergencyContact,
    status,
    location,
  } = req.body;

  try {
    const patient = new Patient({
      name,
      dateOfBirth,
      gender,
      contactInfo,
      medicalHistorySummary,
      emergencyContact,
      status,
      location,
    });

    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
  } catch (error) {
    console.error('Create Patient Error:', error);

    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate patient profile.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid patient data', errors: Object.values(error.errors).map(err => err.message) });
    }
    res.status(500).json({ message: 'Server error during patient creation.', error: error.message });
  }
};

// @desc    Get all patients with pagination and search
// @route   GET /api/v1/patients
// @access  Private (Requires admin or doctor role)
export const getAllPatients = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      // Add other fields to search if necessary, e.g., email from User model if populated
      // { 'contactInfo.phone': { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const patients = await Patient.find(query)
      .populate('userId', 'firstName lastName email role avatarUrl') // Populate user details
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Patient.countDocuments(query);

    res.json({
      patients,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalPatients: count,
    });
  } catch (error) {
    console.error('Get All Patients Error:', error);
    res.status(500).json({ message: 'Server error fetching patients.' });
  }
};

// @desc    Get a single patient by ID
// @route   GET /api/v1/patients/:id
// @access  Private (Patient can see their own, or Admin/Doctor)
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      'userId',
      'firstName lastName email role avatarUrl'
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get Patient By ID Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error fetching patient.' });
  }
};

// @desc    Update a patient's profile
// @route   PUT /api/v1/patients/:id
// @access  Private (Patient can update their own, or Admin/Doctor)
export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Update fields from req.body
    const { userId, ...updateData } = req.body;

    Object.keys(updateData).forEach((key) => {
        // Check for nested objects like contactInfo, location, emergencyContact
        if (typeof updateData[key] === 'object' && patient[key] && typeof patient[key] === 'object') {
            Object.keys(updateData[key]).forEach(nestedKey => {
                if (patient[key][nestedKey] !== undefined) { // only update existing nested fields
                    patient[key][nestedKey] = updateData[key][nestedKey];
                }
            });
        } else if (patient[key] !== undefined) { // only update existing top-level fields
            patient[key] = updateData[key];
        }
    });

    const updatedPatient = await patient.save();
    const populatedPatient = await Patient.findById(updatedPatient._id).populate('userId', 'firstName lastName email role avatarUrl');

    res.json(populatedPatient);
  } catch (error) {
    console.error('Update Patient Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error updating patient.' });
  }
};

// @desc    Delete a patient profile
// @route   DELETE /api/v1/patients/:id
// @access  Private (Requires Admin role)
export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    await patient.deleteOne();

    res.status(204).send();
  } catch (error) {
    console.error('Delete Patient Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error deleting patient.' });
  }
};
