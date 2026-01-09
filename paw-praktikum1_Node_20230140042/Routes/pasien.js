const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasienController');
const { authenticateToken, isAdmin } = require('../middleware/permissionMiddleware');

// Semua route pasien dilindungi (harus login & admin)
router.use(authenticateToken); 
router.use(isAdmin); 

router.get('/', pasienController.getAllPasien);
router.post('/', pasienController.createPasien);
router.put('/:id', pasienController.updatePasien);
router.delete('/:id', pasienController.deletePasien);

module.exports = router;