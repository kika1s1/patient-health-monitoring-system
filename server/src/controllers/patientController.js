import Patient from '../models/Patient.js';

// @desc    Create a new patient profile
// @route   POST /api/v1/patients
// @access  Private (Requires admin or doctor role - to be enforced by authorize middleware in routes)
export const createPatient = async (req, res, next) => {
  const {
    name,
    age,
    gender,
    contactInfo,
    medicalHistorySummary,
    emergencyContact,
    status,
    location,
    room,
    condition,
    additionalInfo
  } = req.body;

  try {
    const patient = new Patient({
      fullName: name, // Assuming 'name' is a string like "John Doe"
      age,
      gender,
      contactInfo,
      medicalHistorySummary,
      emergencyContact,
      status,
      location,
      room,
      condition,
      additionalInfo,
      

    });
    console.log("Creating patient with data:", patient);

    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
  } catch (error) {
    next(error)
  }
};

// @desc    Get all patients with pagination and search
// @route   GET /api/v1/patients
// @access  Private (Requires admin or doctor role)
export const getAllPatients = async (req, res, next) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { 'contactInfo.phone': { $regex: search, $options: 'i' } },
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
    next(error);
  }
};

// @desc    Get a single patient by ID
// @route   GET /api/v1/patients/:id
// @access  Private (Patient can see their own, or Admin/Doctor)
export const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json(patient);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a patient's profile
// @route   PUT /api/v1/patients/:id
// @access  Private (Patient can update their own, or Admin/Doctor)
export const updatePatient = async (req, res, next) => {
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
    next(error);
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
    next(error);
  }
};
