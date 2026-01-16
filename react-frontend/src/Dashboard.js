// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const navigate = useNavigate();
  
  // State Data Dashboard
  const [data, setData] = useState({
    capacity: 0,
    filled: 0,
    available: 0,
    logs: []
  });

  // Cek apakah user sudah login saat halaman dibuka
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      navigate('/'); // Kalau belum login, lempar ke halaman login
    }
  }, [navigate]);

  // Fungsi Fetch Data
  const fetchData = () => {
    axios.get('http://localhost:3001/api/dashboard')
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.error(err));
  };

  // Auto-refresh data
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Hapus sesi
    navigate('/'); // Kembali ke login
  };

  // Logika Warna
  const isFull = data.available <= 0;
  const statusColor = isFull ? '#ff4d4d' : '#4caf50';

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      {/* Header Dashboard */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>Smart Mall Parking Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
      
      {/* KARTU STATUS */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
        {/* Slot Tersedia */}
        <div style={{ 
            border: `3px solid ${statusColor}`, 
            borderRadius: '10px', 
            padding: '20px', 
            width: '250px',
            backgroundColor: isFull ? '#ffe6e6' : '#e8f5e9',
            transition: '0.3s'
        }}>
          <h2>AVAILABLE</h2>
          <h1 style={{ fontSize: '60px', margin: '10px 0', color: statusColor }}>
            {data.available}
          </h1>
          <p>Slot Kosong</p>
        </div>

        {/* Info Detail */}
        <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', width: '250px', backgroundColor: '#fff' }}>
          <h3>Statistik</h3>
          <p>Kapasitas Total: <strong>{data.capacity}</strong></p>
          <p>Terisi Saat Ini: <strong>{data.filled}</strong></p>
          <hr style={{ borderTop: '1px solid #eee' }} />
          <h3 style={{ color: statusColor }}>
            {isFull ? "PARKIR PENUH!" : "SILAHKAN MASUK"}
          </h3>
        </div>
      </div>

      {/* TABEL LOG */}
      <h3 style={{ textAlign: 'left' }}>Aktivitas Terkini (Live)</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px' }}>Waktu</th>
            <th style={{ padding: '12px' }}>Arah</th>
            <th style={{ padding: '12px' }}>Pintu</th>
          </tr>
        </thead>
        <tbody>
          {data.logs.length > 0 ? (
            data.logs.map((log) => (
              <tr key={log.id}>
                <td style={{ padding: '10px' }}>{new Date(log.waktu).toLocaleString()}</td>
                <td style={{ 
                    padding: '10px',
                    color: log.arah === 'MASUK' ? 'green' : 'red',
                    fontWeight: 'bold'
                }}>
                  {log.arah}
                </td>
                <td style={{ padding: '10px' }}>{log.kode_pintu}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ padding: '20px', color: '#999' }}>Belum ada data aktivitas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;