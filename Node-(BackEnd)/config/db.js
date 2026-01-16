const mysql = require('mysql2');

// Konfigurasi Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'smart_parking'
});

db.connect(err => {
    if (err) {
        console.error('Error koneksi database:', err);
        return;
    }
    console.log('Database MySQL Terkoneksi!');
});

module.exports = db;