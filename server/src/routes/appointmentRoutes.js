import express from 'express';
import {
  createAppointment,
  getAppointments,
  // Future controllers like getAppointmentById, updateAppointmentStatus, deleteAppointment
} from '../controllers/appointmentController.js';
// import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes in this router
// router.use(protect);

// @route   POST /api/v1/appointments
// @desc    Create a new appointment
// @access  Private (Authenticated users - patient or doctor can initiate)
// The controller `createAppointment` uses req.user._id as patientId.
// If a doctor is booking for a patient, the patientId might need to be passed in req.body,
// and authorization logic would need to ensure the doctor is permitted to do so.
// For simplicity, current setup assumes the logged-in user is the patient.
// If doctors or admins can book for others, this needs to be `authorize('patient', 'doctor', 'admin')`
// and controller logic adjusted.
router.post('/', createAppointment);


// @route   GET /api/v1/appointments
// @desc    Get appointments for the authenticated user (or all if admin)
// @access  Private
router.get('/', getAppointments); // Controller handles role-based filtering

// Future routes:
// router.get('/:id', getAppointmentById);
// router.put('/:id/status', authorize('doctor', 'admin'), updateAppointmentStatus); // Doctor/Admin can update status
// router.delete('/:id', authorize('admin', 'doctor'), deleteAppointment); // Doctor/Admin can cancel/delete

export default router;
