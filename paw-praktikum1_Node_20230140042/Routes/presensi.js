const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { authenticateToken, isAdmin } = require("../middleware/permissionMiddleware");

// --- GLOBAL MIDDLEWARE ---
// Semua route di bawah baris ini otomatis membutuhkan login (Token Valid)
router.use(authenticateToken);

// --- ROUTES ---

// Route Check-in
// Catatan: 'image' adalah nama key/field yang harus Anda gunakan di Postman (Form-data)
router.post('/check-in', presensiController.upload.single('image'), presensiController.CheckIn);

// Route Check-out
router.post("/check-out", presensiController.CheckOut);

// Route Update (Hanya Admin yang bisa update data user lain)
router.put("/:id", isAdmin, presensiController.updatePresensi);

// Route Hapus (Hanya pemilik data yang bisa menghapus, logic validasi ada di controller)
router.delete("/:id", presensiController.hapusPresensi);

module.exports = router;