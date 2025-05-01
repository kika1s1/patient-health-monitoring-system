import express from 'express';
import { echoData } from '../controllers/utilityController.js';
import { processBluetoothData } from '../controllers/sensorDataController.js';

const router = express.Router();

// @route   POST /api/v1/utility/echo-data
// @desc    Echo back the request body
// @access  Private (Requires API Key)
router.post('/echo-data', echoData);

// @route   POST /api/v1/utility/bluetooth-data
// @desc    Process and save sensor data from Bluetooth devices
// @access  Private (Requires API Key)
router.post('/bluetooth-data', processBluetoothData);

export default router;
