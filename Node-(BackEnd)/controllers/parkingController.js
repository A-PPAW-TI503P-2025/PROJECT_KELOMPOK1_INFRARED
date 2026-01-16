const ParkingModel = require('../models/parkingModel');

// Controller untuk Dashboard
exports.getDashboard = (req, res) => {
    // 1. Ambil Kapasitas
    ParkingModel.getSetting('kapasitas_total', (err, resultCap) => {
        if (err) return res.status(500).send(err);
        
        // Handle jika setting tidak ditemukan
        const maxCapacity = resultCap.length > 0 ? parseInt(resultCap[0].nilai) : 0;

        // 2. Hitung Mobil Masuk
        ParkingModel.countLogsByDirection('MASUK', (err, resIn) => {
            if (err) return res.status(500).send(err);
            const totalIn = resIn[0].total;

            // 3. Hitung Mobil Keluar
            ParkingModel.countLogsByDirection('KELUAR', (err, resOut) => {
                if (err) return res.status(500).send(err);
                const totalOut = resOut[0].total;

                // --- LOGIKA UTAMA DI SINI ---
                const currentFilled = totalIn - totalOut;
                const availableSlots = maxCapacity - currentFilled;

                // 4. Ambil 5 Log Terakhir
                ParkingModel.getRecentLogs(5, (err, logs) => {
                    if (err) return res.status(500).send(err);

                    // Kirim Response JSON (View)
                    res.json({
                        capacity: maxCapacity,
                        filled: currentFilled < 0 ? 0 : currentFilled,
                        available: availableSlots,
                        logs: logs
                    });
                });
            });
        });
    });
};

// Controller untuk Sensor Arduino
exports.addSensorData = (req, res) => {
    const { arah, kode_pintu } = req.body;

    // Validasi input sederhana
    if (!arah || !kode_pintu) {
        return res.status(400).send("Data tidak lengkap!");
    }

    ParkingModel.addLog(arah, kode_pintu, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(`Berhasil! Data mobil ${arah} di ${kode_pintu} tersimpan.`);
    });
};