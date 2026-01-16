import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './App.css';

// --- REGISTRASI KOMPONEN CHART ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// --- 1. HALAMAN LOGIN ---
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Hardcode Login
      if (username === 'admin' && password === 'admin123') {
        onLogin();
      } else {
        setError('Username atau Password salah!');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-visual">
        <div className="visual-content">
          <div className="logo-emoji">🚘</div>
          <h1 className="visual-title">Smart Mall</h1>
          <p className="visual-subtitle">Intelligent Parking System Management</p>
        </div>
      </div>
      <div className="login-form-wrapper">
        <div className="login-card">
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#1e293b' }}>Welcome Back</h2>
            <p style={{ color: '#64748b', margin: 0 }}>Please enter your details to sign in.</p>
          </div>
          {error && <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', borderLeft: '4px solid #ef4444' }}>⚠️ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Admin Username</label>
              <input className="input-premium" type="text" placeholder="e.g. admin" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input className="input-premium" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- 2. HALAMAN DASHBOARD ---
function DashboardPage({ onLogout }) {
  const [data, setData] = useState({ capacity: 0, filled: 0, available: 0, logs: [] });
  
  // --- STATE UNTUK FITUR EDIT ---
  const [isEditing, setIsEditing] = useState(false);
  const [newCapacity, setNewCapacity] = useState(0);

  // Fungsi Fetch Data
  const fetchData = () => {
    axios.get('http://localhost:3001/api/dashboard')
      .then(res => {
        setData(res.data);
        if (!isEditing) setNewCapacity(res.data.capacity);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [isEditing]);

  // Fungsi Simpan Kapasitas Baru
  const handleUpdateCapacity = () => {
    axios.post('http://localhost:3001/api/settings', { newCapacity: parseInt(newCapacity) })
      .then(res => {
        alert('✅ Kapasitas Berhasil Diupdate!');
        setIsEditing(false);
        fetchData();
      })
      .catch(err => {
        console.error(err);
        alert('❌ Gagal mengupdate kapasitas.');
      });
  };

  // --- LOGIKA DATA GRAFIK (KUMULATIF REAL-TIME) ---
  const chartData = useMemo(() => {
    // 1. Urutkan log dari yang terlama ke terbaru
    const sortedLogs = [...data.logs].sort((a, b) => new Date(a.waktu) - new Date(b.waktu));
    
    // 2. Siapkan array untuk sumbu X (Waktu) dan Y (Jumlah Kumulatif)
    const labels = [];
    const dataMasuk = [];
    const dataKeluar = [];
    
    let runningMasuk = 0;
    let runningKeluar = 0;

    sortedLogs.forEach(log => {
      // Format Waktu: 10:45:01
      const timeLabel = new Date(log.waktu).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      labels.push(timeLabel);

      if (log.arah === 'MASUK') {
        runningMasuk += 1;
      } else {
        runningKeluar += 1;
      }

      dataMasuk.push(runningMasuk);
      dataKeluar.push(runningKeluar);
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Total Masuk',
          data: dataMasuk,
          borderColor: '#10b981', // Hijau
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.3, // Garis agak melengkung
          fill: true
        },
        {
          label: 'Total Keluar',
          data: dataKeluar,
          borderColor: '#ef4444', // Merah
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  }, [data.logs]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Supaya bisa diatur tingginya manual
    plugins: {
      legend: { position: 'bottom' }, // Legend di bawah biar rapi
      title: { display: true, text: 'Aktivitas Kendaraan (Real-Time Timeline)' },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  const isFull = data.available <= 0;
  const mainColor = isFull ? '#ef4444' : '#10b981';

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>
            🅿️ Mall Dashboard 
            <span className="live-indicator" style={{ backgroundColor: mainColor }}></span>
          </h1>
          <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '35px' }}>Live Monitoring System</span>
        </div>
        <button onClick={onLogout} className="btn-logout">Logout</button>
      </div>

      <div className="stats-container">
        {/* KARTU 1: SLOT TERSEDIA */}
        <div className="card card-available" style={{ borderColor: isFull ? '#fca5a5' : '#86efac', background: isFull ? '#fef2f2' : '#f0fdf4' }}>
          <span className="card-label">Slot Tersedia</span>
          <span className="big-number" style={{ color: mainColor }}>{data.available}</span>
          <div className="status-chip" style={{ background: isFull ? '#fee2e2' : '#dcfce7', color: mainColor }}>
            {isFull ? "⛔ PARKIR PENUH" : "✅ TERSEDIA"}
          </div>
        </div>

        {/* KARTU 2: INFO DETAIL & EDIT */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#1e293b' }}>⚙️ Kontrol Area</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)} 
                style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#3b82f6', fontWeight: 'bold' }}
              >
                Ubah Kapasitas
              </button>
            )}
          </div>
          
          <div className="info-row">
            <span className="info-label">Mobil Terparkir</span>
            <span className="info-value">{data.filled} Unit</span>
          </div>

          <div style={{ marginTop: '20px' }}>
            <span className="info-label" style={{ display: 'block', marginBottom: '5px' }}>TOTAL KAPASITAS</span>
            
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setNewCapacity(c => Math.max(0, parseInt(c) - 5))} style={{ padding: '5px 10px', cursor: 'pointer' }}>-5</button>
                  <input 
                    type="number" 
                    value={newCapacity} 
                    onChange={(e) => setNewCapacity(e.target.value)}
                    style={{ width: '100%', padding: '8px', textAlign: 'center', fontWeight: 'bold', border: '2px solid #3b82f6', borderRadius: '5px' }}
                  />
                  <button onClick={() => setNewCapacity(c => parseInt(c) + 5)} style={{ padding: '5px 10px', cursor: 'pointer' }}>+5</button>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleUpdateCapacity} className="btn-primary" style={{ padding: '10px', marginTop: 0 }}>Simpan</button>
                  <button onClick={() => setIsEditing(false)} className="btn-logout" style={{ background: '#f1f5f9', color: '#64748b' }}>Batal</button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>
                {data.capacity} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#94a3b8' }}>Slot</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- BAGIAN GRAFIK (DITENGAHKAN) --- */}
      <div className="table-card" style={{ marginBottom: '20px', maxWidth: '850px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ padding: '20px' }}>
           {chartData.labels.length > 0 ? (
             <div style={{ height: '350px', width: '100%' }}>
               <Line options={chartOptions} data={chartData} />
             </div>
           ) : (
             <p style={{ textAlign: 'center', color: '#94a3b8', padding: '50px' }}>
               Belum ada data aktivitas untuk ditampilkan.
             </p>
           )}
        </div>
      </div>

      {/* TABEL LOG */}
      <div className="table-card">
        <div className="table-header"><h3>Traffic Log Activity</h3></div>
        <table>
          <thead>
            <tr><th>Waktu Deteksi</th><th>Status Arah</th><th>Lokasi Pintu</th></tr>
          </thead>
          <tbody>
            {data.logs.length > 0 ? (
              data.logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    {new Date(log.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                  </td>
                  <td>
                    <span className={`badge ${log.arah === 'MASUK' ? 'badge-in' : 'badge-out'}`}>
                      {log.arah === 'MASUK' ? '⬇️ MASUK' : '⬆️ KELUAR'}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{log.kode_pintu}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Belum ada aktivitas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- APP UTAMA ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const handleLogin = () => { setIsLoggedIn(true); localStorage.setItem('isLoggedIn', 'true'); };
  const handleLogout = () => { setIsLoggedIn(false); localStorage.removeItem('isLoggedIn'); };

  return (
    <div className="App">
      {isLoggedIn ? <DashboardPage onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;