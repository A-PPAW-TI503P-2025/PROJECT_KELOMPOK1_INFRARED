const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // [BARU] Import module fs

// [BARU] Cek dan buat folder 'uploads' secara otomatis saat server jalan
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Folder 'uploads' berhasil dibuat otomatis.");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.ext
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

// CHECK IN
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId } = req.user; // Ambil ID dari token user

    // Ambil path foto jika ada upload
    // Gunakan replace agar path pemisah windows (\) jadi (/) supaya aman di JSON
    const buktiFoto = req.file ? req.file.path.replace(/\\/g, "/") : null; 

    // Cek apakah sudah check-in hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sudahCheckin = await Presensi.findOne({
      where: {
        userId,
        checkIn: {
          [Op.gte]: today
        }
      }
    });

    if (sudahCheckin) {
      return res.status(400).json({
        message: "Anda sudah melakukan check-in hari ini!"
      });
    }

    const presensi = await Presensi.create({
      userId,
      checkIn: new Date(),
      latitude: req.body.latitude || null,
      longitude: req.body.longitude || null,
      buktiFoto: buktiFoto
    });

    res.json({
      message: "Check-in berhasil",
      data: presensi
    });

  } catch (error) {
    console.error("Error CheckIn:", error); 
    res.status(500).json({ message: "Gagal check-in", error: error.message });
  }
};

// CHECK OUT
exports.CheckOut = async (req, res) => {
  try {
    const userId = req.user.id;

    const presensi = await Presensi.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });

    if (!presensi || presensi.checkOut) {
      return res.status(400).json({ message: "Belum check-in atau sudah check-out!" });
    }

    presensi.checkOut = new Date();
    await presensi.save();

    res.json({
      message: "Check-out berhasil",
      data: presensi
    });

  } catch (error) {
    console.error("Error CheckOut:", error);
    res.status(500).json({ message: "Gagal check-out", error: error.message });
  }
};

// UPDATE (ADMIN SAJA)
exports.updatePresensi = async (req, res) => {
  try {
    const id = req.params.id;

    const presensi = await Presensi.findByPk(id);
    if (!presensi) return res.status(404).json({ message: "Data presensi tidak ditemukan" });

    await presensi.update(req.body);

    res.json({ message: "Presensi diperbarui", data: presensi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal update presensi", error });
  }
};

// HAPUS (HANYA PEMILIK)
exports.hapusPresensi = async (req, res) => {
  try {
    const id = req.params.id;

    const presensi = await Presensi.findByPk(id);
    if (!presensi) return res.status(404).json({ message: "Data tidak ditemukan" });

    // Cek kepemilikan
    if (presensi.userId !== req.user.id) {
      return res.status(403).json({ message: "Tidak boleh menghapus presensi orang lain!" });
    }

    await presensi.destroy();
    res.json({ message: "Presensi berhasil dihapus" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus presensi", error });
  }
};