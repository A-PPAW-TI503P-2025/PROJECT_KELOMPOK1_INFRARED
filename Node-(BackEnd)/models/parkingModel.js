const db = require('../config/db');

const ParkingModel = {
    // 1. Ambil nilai setting
    getSetting: (key, callback) => {
        const sql = "SELECT nilai FROM settings WHERE nama_setting = ?";
        db.query(sql, [key], callback);
    },

    // --- BAGIAN INI YANG BIKIN ANTI-GAGAL ---
    updateSetting: (key, value, callback) => {
        // Coba UPDATE dulu
        const sqlUpdate = "UPDATE settings SET nilai = ? WHERE nama_setting = ?";
        db.query(sqlUpdate, [value, key], (err, result) => {
            if (err) return callback(err, null);

            // Jika update tidak ngefek (artinya data kosong/belum ada)
            if (result.affectedRows === 0) {
                console.log(`[AUTO-FIX] Data '${key}' kosong. Membuat data baru...`);
                
                // Lakukan INSERT otomatis
                const sqlInsert = "INSERT INTO settings (nama_setting, nilai) VALUES (?, ?)";
                db.query(sqlInsert, [key, value], (errInsert, resInsert) => {
                    if (errInsert) return callback(errInsert, null);
                    // Berhasil Insert
                    callback(null, { message: "Data baru berhasil dibuat", ...resInsert });
                });
            } else {
                // Berhasil Update (Data memang sudah ada)
                callback(null, result);
            }
        });
    },
    // ----------------------------------------

    // Hitung jumlah mobil
    countLogsByDirection: (direction, callback) => {
        const sql = "SELECT COUNT(*) as total FROM parking_logs WHERE arah = ?";
        db.query(sql, [direction], callback);
    },

    // Ambil log terakhir
    getRecentLogs: (limit, callback) => {
        const sql = `SELECT * FROM parking_logs ORDER BY waktu DESC LIMIT ${parseInt(limit)}`;
        db.query(sql, callback);
    },

    // Tambah log baru
    addLog: (arah, kode_pintu, callback) => {
        const sql = "INSERT INTO parking_logs (arah, kode_pintu) VALUES (?, ?)";
        db.query(sql, [arah, kode_pintu], callback);
    }
};

module.exports = ParkingModel;