// server/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 1. Koneksi Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Sesuaikan user mysql kamu
    password: '',      // Sesuaikan password mysql kamu
    database: 'smart_parking'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database MySQL Terkoneksi!');
});

// --- API ROUTES ---

// 2. API Dashboard (Dihitung Real-time)
app.get('/api/dashboard', (req, res) => {
    // Ambil Kapasitas
    db.query("SELECT nilai FROM settings WHERE nama_setting = 'kapasitas_total'", (err, resultCap) => {
        if (err) return res.status(500).send(err);
        
        const maxCapacity = parseInt(resultCap[0].nilai);

        // Hitung Mobil Masuk
        db.query("SELECT COUNT(*) as total FROM parking_logs WHERE arah = 'MASUK'", (err, resIn) => {
            const totalIn = resIn[0].total;

            // Hitung Mobil Keluar
            db.query("SELECT COUNT(*) as total FROM parking_logs WHERE arah = 'KELUAR'", (err, resOut) => {
                const totalOut = resOut[0].total;

                // LOGIKA UTAMA
                const currentFilled = totalIn - totalOut;
                const availableSlots = maxCapacity - currentFilled;

                // Ambil 5 Log Terakhir
                db.query("SELECT * FROM parking_logs ORDER BY waktu DESC LIMIT 5", (err, logs) => {
                    res.json({
                        capacity: maxCapacity,
                        filled: currentFilled < 0 ? 0 : currentFilled, // Cegah minus
                        available: availableSlots,
                        logs: logs
                    });
                });
            });
        });
    });
});

// 3. API Input dari Arduino (Sensor)
// Arduino kirim JSON: { "arah": "MASUK", "kode_pintu": "GATE-1" }
app.post('/api/sensor', (req, res) => {
    const { arah, kode_pintu } = req.body;
    
    // Cek Status Toko dulu (Opsional, skip kalau mau simpel)
    const sql = "INSERT INTO parking_logs (arah, kode_pintu) VALUES (?, ?)";
    db.query(sql, [arah, kode_pintu], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Data Sensor Masuk!");
    });
});

// Jalankan Server
app.listen(3001, () => {
    console.log('Server berjalan di port 3001');
});