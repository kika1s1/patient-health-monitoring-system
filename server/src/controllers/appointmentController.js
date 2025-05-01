import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

// @desc    Create a new appointment
// @route   POST /api/v1/appointments
// @access  Private (Patient or Doctor can create)
export const createAppointment = async (req, res) => {
  const patientId = req.user._id; // Authenticated user making the request
  const {
    doctorId, // Doctor for the appointment
    startTime,
    endTime,
    title,
    description,
    videoLink,
  } = req.body;

  try {
    // Validate inputs
    if (!doctorId || !startTime || !endTime) {
      return res.status(400).json({ message: 'Doctor ID, start time, and end time are required.' });
    }

    // Validate patient (current user)
    const patientUser = await User.findById(patientId);
    if (!patientUser || (patientUser.role !== 'patient' && patientUser.role !== 'admin' && patientUser.role !== 'doctor')) { // Allow doctors/admins to book for patients too
      return res.status(400).json({ message: 'Invalid patient user or role.' });
    }

    // Validate doctor
    const doctorUser = await User.findById(doctorId);
    if (!doctorUser || doctorUser.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found or invalid role.' });
    }

    // Validate times
    const appointmentStartTime = new Date(startTime);
    const appointmentEndTime = new Date(endTime);

    if (isNaN(appointmentStartTime.getTime()) || isNaN(appointmentEndTime.getTime())) {
      return res.status(400).json({ message: 'Invalid date format for start or end time.' });
    }
    if (appointmentStartTime >= appointmentEndTime) {
      return res.status(400).json({ message: 'Start time must be before end time.' });
    }
    if (appointmentStartTime < new Date()) {
        return res.status(400).json({ message: 'Cannot schedule appointments in the past.' });
    }


    // Check for Doctor's availability (no overlapping appointments)
    const doctorOverlappingAppointment = await Appointment.findOne({
      doctorId,
      status: { $in: ['scheduled', 'confirmed'] },
      $or: [
        { startTime: { $lt: appointmentEndTime, $gte: appointmentStartTime } },
        { endTime: { $gt: appointmentStartTime, $lte: appointmentEndTime } },
        { startTime: { $lte: appointmentStartTime }, endTime: { $gte: appointmentEndTime } }
      ],
    });

    if (doctorOverlappingAppointment) {
      return res.status(409).json({ message: 'Doctor is unavailable during the requested time slot (overlapping appointment).' });
    }

    // Check for Patient's availability (no overlapping appointments)
    const patientOverlappingAppointment = await Appointment.findOne({
      patientId, // The patient for whom the appointment is being booked
      status: { $in: ['scheduled', 'confirmed'] },
      $or: [
        { startTime: { $lt: appointmentEndTime, $gte: appointmentStartTime } },
        { endTime: { $gt: appointmentStartTime, $lte: appointmentEndTime } },
        { startTime: { $lte: appointmentStartTime }, endTime: { $gte: appointmentEndTime } }
      ],
    });

    if (patientOverlappingAppointment) {
      return res.status(409).json({ message: 'Patient has an overlapping appointment during the requested time slot.' });
    }

    const appointment = new Appointment({
      patientId, // The user creating the appointment is the patient
      doctorId,
      startTime: appointmentStartTime,
      endTime: appointmentEndTime,
      title,
      description,
      videoLink,
      status: 'scheduled', // Default status
    });

    const createdAppointment = await appointment.save();
    await createdAppointment.populate('patientId', 'firstName lastName email avatarUrl');
    await createdAppointment.populate('doctorId', 'firstName lastName email avatarUrl specialty');


    res.status(201).json(createdAppointment);
  } catch (error) {
    console.error('Create Appointment Error:', error);
    res.status(500).json({ message: 'Server error creating appointment.' });
  }
};

// @desc    Get appointments for the authenticated user
// @route   GET /api/v1/appointments
// @access  Private
export const getAppointments = async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const { startDate, endDate, status, page = 1, limit = 10 } = req.query;

  const query = {};

  // Role-based filtering
  if (userRole === 'patient') {
    query.patientId = userId;
  } else if (userRole === 'doctor') {
    query.doctorId = userId;
  } else if (userRole !== 'admin') {
    // If not admin, patient, or doctor, they shouldn't see any appointments
    return res.status(403).json({ message: 'Not authorized to view appointments.' });
  }
  // For admin, query remains empty to fetch all, or admin-specific filters can be added.

  // Date filtering
  if (startDate || endDate) {
    query.startTime = {}; // Using startTime for date range queries
    if (startDate) {
      query.startTime.$gte = new Date(startDate);
    }
    if (endDate) {
      // To include appointments that start on the endDate, we might need to adjust the end of the day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query.startTime.$lte = endOfDay;
    }
  }

  // Status filtering
  if (status) {
    query.status = status;
  }

  try {
    const appointments = await Appointment.find(query)
      .populate('patientId', 'firstName lastName email avatarUrl')
      .populate('doctorId', 'firstName lastName email avatarUrl specialty') // Assuming Doctor model might have specialty
      .sort({ startTime: 1 }) // Sort by start time, ascending
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Appointment.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalAppointments: count,
    });
  } catch (error) {
    console.error('Get Appointments Error:', error);
    res.status(500).json({ message: 'Server error fetching appointments.' });
  }
};
