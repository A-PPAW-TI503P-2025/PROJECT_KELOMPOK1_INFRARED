const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

// Route GET dashboard
router.get('/dashboard', parkingController.getDashboard);

// Route POST sensor
router.post('/sensor', parkingController.addSensorData);

module.exports = router;