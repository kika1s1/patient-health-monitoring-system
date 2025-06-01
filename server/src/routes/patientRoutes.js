import express from 'express';
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from '../controllers/patientController.js';
import vitalRoutes from './vitalRoutes.js'; 
import protectedRoute from '../middleware/auth.middleware.js';
const router = express.Router();

// Apply protect middleware to all routes in this router
// router.use(protect);

// @route   POST /api/v1/patients
// @desc    Create a new patient profile
// @access  Private (Any authenticated user for testing)
// Allow open registration for testing (no auth middleware)
router.post('/',protectedRoute, createPatient);

// @route   GET /api/v1/patients
// @desc    Get all patients with pagination and search
// @access  Private (Admin or Doctor)
router.get('/',protectedRoute, getAllPatients);

// @route   GET /api/v1/patients/:id
// @desc    Get a single patient by ID
// @access  Private (Patient can see their own, or Admin/Doctor)
router.get('/:id',protectedRoute, getPatientById);

// @route   PUT /api/v1/patients/:id
// @desc    Update a patient's profile
// @access  Private (Patient can update their own, or Admin/Doctor)
router.put('/:id',protectedRoute, updatePatient); // Specific authorization is handled within the controller

// @route   DELETE /api/v1/patients/:id
// @desc    Delete a patient profile
// @access  Private (Admin only)
router.delete('/:id',protectedRoute, deletePatient);

// Mount vital routes for a specific patient
router.use('/:patientId/vitals', protectedRoute, vitalRoutes);

export default router;
