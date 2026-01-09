const express = require("express");
const router = express.Router();

const presensiController = require("../controllers/presensiController");
const { authenticateToken, isAdmin } = require("../middleware/permissionMiddleware");

// 1. Route Check-In
router.use(authenticateToken);

router.post('/check-in', 
    presensiController.upload.single('image'), 
    presensiController.CheckIn
);

// 3. Route Check-Out
router.post("/check-out", presensiController.CheckOut);

// 4. Update & Delete
router.put("/:id", isAdmin, presensiController.updatePresensi);
router.delete("/:id", presensiController.hapusPresensi);

module.exports = router;