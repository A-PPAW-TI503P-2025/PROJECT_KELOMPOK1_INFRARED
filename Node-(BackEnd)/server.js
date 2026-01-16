const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const parkingRoutes = require('./routes/parkingRoutes');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json()); // WAJIB: Supaya bisa baca data JSON dari frontend
app.use(bodyParser.urlencoded({ extended: true }));

// Gunakan Routes
app.use('/api', parkingRoutes);

// Jalankan Server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});