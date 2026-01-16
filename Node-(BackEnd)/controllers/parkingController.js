const ParkingModel = require('../models/parkingModel');

// 1. Controller Dashboard
exports.getDashboard = (req, res) => {
    ParkingModel.getSetting('kapasitas_total', (err, resultCap) => {
        if (err) return res.status(500).send(err);
        
        // Default ke 50 jika database masih kosong
        const maxCapacity = resultCap.length > 0 ? parseInt(resultCap[0].nilai) : 50;

        ParkingModel.countLogsByDirection('MASUK', (err, resIn) => {
            if (err) return res.status(500).send(err);
            const totalIn = resIn[0].total;

            ParkingModel.countLogsByDirection('KELUAR', (err, resOut) => {
                if (err) return res.status(500).send(err);
                const totalOut = resOut[0].total;

                const currentFilled = totalIn - totalOut;
                const availableSlots = maxCapacity - currentFilled;

                ParkingModel.getRecentLogs(5, (err, logs) => {
                    if (err) return res.status(500).send(err);

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

// 2. Controller Update Kapasitas (ANTI-GAGAL)
exports.updateCapacity = (req, res) => {
    const { newCapacity } = req.body;

    // Pastikan ada isinya (angka 0 pun boleh)
    if (newCapacity === undefined || newCapacity === null || newCapacity === '') {
        return res.status(400).json({ success: false, message: "Nilai kapasitas tidak valid!" });
    }

    // Panggil fungsi model yang baru (Auto Update/Insert)
    ParkingModel.updateSetting('kapasitas_total', newCapacity, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }
        res.json({ success: true, message: "Kapasitas berhasil disimpan!" });
    });
};

// 3. Controller Sensor
exports.addSensorData = (req, res) => {
    const { arah, kode_pintu } = req.body;
    if (!arah || !kode_pintu) return res.status(400).send("Data tidak lengkap!");

    ParkingModel.addLog(arah, kode_pintu, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Data tersimpan.");
    });
};