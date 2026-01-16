const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

// Route GET Dashboard
router.get('/dashboard', parkingController.getDashboard);

// Route POST Update Settings (Jalur untuk tombol 'Simpan' di UI)
router.post('/settings', parkingController.updateCapacity);

// Route POST Sensor
router.post('/sensor', parkingController.addSensorData);

module.exports = router;