// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Kita pakai CSS standar React

function App() {
  const [data, setData] = useState({
    capacity: 0,
    filled: 0,
    available: 0,
    logs: []
  });

  // Fungsi ambil data dari backend
  const fetchData = () => {
    axios.get('http://localhost:3001/api/dashboard')
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.error(err));
  };

  // Auto-refresh setiap 2 detik (Real-time feeling)
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000); 
    return () => clearInterval(interval);
  }, []);

  // Tentukan Warna Status
  const isFull = data.available <= 0;
  const statusColor = isFull ? '#ff4d4d' : '#4caf50'; // Merah atau Hijau

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Smart Mall Parking Dashboard</h1>
      
      {/* KARTU STATUS UTAMA */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
        
        {/* Slot Tersedia (Penting) */}
        <div style={{ 
            border: `3px solid ${statusColor}`, 
            borderRadius: '10px', 
            padding: '20px', 
            width: '250px',
            backgroundColor: isFull ? '#ffe6e6' : '#e8f5e9'
        }}>
          <h2>AVAILABLE</h2>
          <h1 style={{ fontSize: '60px', margin: '10px 0', color: statusColor }}>
            {data.available}
          </h1>
          <p>Slot Kosong</p>
        </div>

        {/* Info Detail */}
        <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', width: '250px' }}>
          <h3>Statistik</h3>
          <p>Kapasitas Total: <strong>{data.capacity}</strong></p>
          <p>Terisi Saat Ini: <strong>{data.filled}</strong></p>
          <hr />
          <h3 style={{ color: statusColor }}>
            {isFull ? "PARKIR PENUH!" : "SILAHKAN MASUK"}
          </h3>
        </div>
      </div>

      {/* TABEL LOG AKTIVITAS */}
      <h3>Aktivitas Terkini (Live)</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>Waktu</th>
            <th>Arah</th>
            <th>Pintu</th>
          </tr>
        </thead>
        <tbody>
          {data.logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.waktu).toLocaleString()}</td>
              <td style={{ 
                  color: log.arah === 'MASUK' ? 'green' : 'red',
                  fontWeight: 'bold'
              }}>
                {log.arah}
              </td>
              <td>{log.kode_pintu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;