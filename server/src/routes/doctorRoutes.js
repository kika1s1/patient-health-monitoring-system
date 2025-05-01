import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  upsertDoctorProfile,
} from '../controllers/doctorController.js';
// import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes in this router, as they require authentication
// router.use(protect);

// @route   GET /api/v1/doctors
// @desc    Get all doctors with pagination and filtering
// @access  Private (Authenticated users)
router.get('/', getAllDoctors);

// @route   GET /api/v1/doctors/profile/me
// @desc    Create or Update the logged-in user's doctor profile
// @access  Private (Users with 'doctor' role)
// Note: This route is placed before '/:id' to ensure 'profile/me' is not treated as an ID.
router.post('/profile', upsertDoctorProfile);
router.put('/profile', upsertDoctorProfile);

// @route   GET /api/v1/doctors/:id
// @desc    Get a single doctor by their Doctor model ID
// @access  Private (Authenticated users)
router.get('/:id', getDoctorById);


// Future routes for Admin management of doctor profiles could be added here:
// Example:
// router.post('/', authorize('admin'), createDoctorProfileForUser);
// router.put('/:id', authorize('admin'), updateDoctorProfileByAdmin);
// router.delete('/:id', authorize('admin'), deleteDoctorProfileByAdmin);


export default router;
