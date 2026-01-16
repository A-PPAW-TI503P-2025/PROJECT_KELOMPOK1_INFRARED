const db = require('../config/db');

const ParkingModel = {
    // Ambil nilai setting (kapasitas)
    getSetting: (key, callback) => {
        const sql = "SELECT nilai FROM settings WHERE nama_setting = ?";
        db.query(sql, [key], callback);
    },

    // Hitung jumlah mobil berdasarkan arah (MASUK/KELUAR)
    countLogsByDirection: (direction, callback) => {
        const sql = "SELECT COUNT(*) as total FROM parking_logs WHERE arah = ?";
        db.query(sql, [direction], callback);
    },

    // Ambil log aktivitas terakhir
    getRecentLogs: (limit, callback) => {
        // Pastikan limit adalah integer
        const sql = `SELECT * FROM parking_logs ORDER BY waktu DESC LIMIT ${parseInt(limit)}`;
        db.query(sql, callback);
    },

    // Tambah data log baru
    addLog: (arah, kode_pintu, callback) => {
        const sql = "INSERT INTO parking_logs (arah, kode_pintu) VALUES (?, ?)";
        db.query(sql, [arah, kode_pintu], callback);
    }
};

module.exports = ParkingModel;