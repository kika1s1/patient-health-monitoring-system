import express from 'express';
import {
  getVitalsForPatient,
  addVitalForPatient,
} from '../controllers/vitalController.js';

// The Express router option mergeParams: true is needed to access patientId from the parent router (patientRoutes.js)
const router = express.Router({ mergeParams: true });

// protect middleware to all routes in this router, as they involve sensitive patient data
// router.use(protect);

// @route   GET /api/v1/patients/:patientId/vitals
// @desc    Get vital records for a specific patient
// @access  Private (Patient can see their own, Doctor/Admin can see any - controller handles specifics)
router.get('/', getVitalsForPatient); // Authorization is handled within the controller

// @route   POST /api/v1/patients/:patientId/vitals
// @desc    Add a new vital record for a specific patient
// @access  Private (Patient can add their own, Doctor/Admin can add for any - controller handles specifics)
// Specific role authorization can be added here if needed, e.g. authorize('doctor', 'admin', 'patient')
// However, the controller already implements fine-grained checks.
router.post('/', addVitalForPatient);

export default router;
