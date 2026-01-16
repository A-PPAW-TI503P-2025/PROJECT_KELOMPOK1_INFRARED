const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Routes
const parkingRoutes = require('./routes/parkingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gunakan Routes
// Semua URL di parkingRoutes akan diawali dengan /api
app.use('/api', parkingRoutes);

// Jalankan Server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});