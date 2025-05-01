import Doctor from '../models/Doctor.js';
import User from '../models/User.js'; // For populating user details

// @desc    Get all doctors with pagination and filtering by specialty
// @route   GET /api/v1/doctors
// @access  Private (Authenticated users)
export const getAllDoctors = async (req, res) => {
  const { page = 1, limit = 10, specialty = '' } = req.query;
  const query = {};

  if (specialty) {
    query.specialty = { $regex: specialty, $options: 'i' }; // Case-insensitive search
  }

  try {
    const doctors = await Doctor.find(query)
      .populate('userId', 'firstName lastName email role avatarUrl') // Populate user details
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Doctor.countDocuments(query);

    res.json({
      doctors,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalDoctors: count,
    });
  } catch (error) {
    console.error('Get All Doctors Error:', error);
    res.status(500).json({ message: 'Server error fetching doctors.' });
  }
};

// @desc    Get a single doctor by their Doctor model ID
// @route   GET /api/v1/doctors/:id
// @access  Private (Authenticated users)
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'userId',
      'firstName lastName email role avatarUrl'
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get Doctor By ID Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Doctor not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server error fetching doctor.' });
  }
};

// Optional: Create Doctor Profile (for Admin or a user creating their own doctor profile)
// @desc    Create or update a doctor profile for the logged-in user or a specific user (admin)
// @route   POST /api/v1/doctors/profile
// @access  Private (Admin or Doctor creating their own profile)
// Note: For simplicity, this controller assumes a user with role 'doctor' is creating/updating their OWN profile.
// A more complex setup would be needed for Admins to create profiles for other users.
export const upsertDoctorProfile = async (req, res) => {
  const {
    name, // This could be pre-filled from req.user if it's the doctor themselves
    specialty,
    qualifications,
    yearsOfExperience,
    consultationFee,
    availability,
  } = req.body;

  // The userId will be the ID of the logged-in user (from protect middleware)
  // Ensure the logged-in user has the 'doctor' role if they are creating their own profile
  if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'User must have a "doctor" role to create/update a doctor profile.' });
  }

  const userId = req.user._id;


  try {
    // Check if user exists (though protect middleware should ensure this)
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'Associated user account not found.' });
    }
     if (userExists.role !== 'doctor') {
      return res.status(403).json({ message: 'The user associated with this profile must have the role "doctor".' });
    }


    let doctor = await Doctor.findOne({ userId });

    if (doctor) {
      // Update existing profile
      doctor.name = name || doctor.name; // Use existing name if not provided
      doctor.specialty = specialty || doctor.specialty;
      doctor.qualifications = qualifications || doctor.qualifications;
      doctor.yearsOfExperience = yearsOfExperience !== undefined ? yearsOfExperience : doctor.yearsOfExperience;
      doctor.consultationFee = consultationFee !== undefined ? consultationFee : doctor.consultationFee;
      doctor.availability = availability || doctor.availability;

    } else {
      // Create new profile
      // Validate required fields for creation
      if (!name || !specialty) {
        return res.status(400).json({ message: 'Name and specialty are required to create a doctor profile.' });
      }
      doctor = new Doctor({
        userId,
        name,
        specialty,
        qualifications,
        yearsOfExperience,
        consultationFee,
        availability,
      });
    }

    const savedDoctor = await doctor.save();
    const populatedDoctor = await Doctor.findById(savedDoctor._id).populate('userId', 'firstName lastName email role avatarUrl');

    res.status(doctor ? 200 : 201).json(populatedDoctor);
  } catch (error) {
    console.error('Upsert Doctor Profile Error:', error);
    if (error.code === 11000) { // Duplicate key error for userId
        return res.status(400).json({ message: 'Doctor profile already exists for this user.' });
    }
    res.status(500).json({ message: 'Server error creating/updating doctor profile.' });
  }
};
