import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './App.css';

// --- REGISTRASI CHART ---
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- KOMPONEN NAVIGASI (Menu Atas) ---
function Navbar({ onLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-brand">🚘 Smart Mall</div>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>Dashboard</Link>
        <Link to="/logs" className={isActive('/logs')}>Activity Logs</Link>
      </div>
      <button onClick={onLogout} className="btn-logout-small">Logout</button>
    </nav>
  );
}

// --- 1. HALAMAN LOGIN (Tidak Berubah Banyak) ---
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
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
          <h2>Welcome Back</h2>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username</label>
              <input className="input-premium" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input className="input-premium" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- 2. HALAMAN DASHBOARD (Hanya Grafik & Kartu) ---
function DashboardPage() {
  const [data, setData] = useState({ capacity: 0, filled: 0, available: 0, logs: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [newCapacity, setNewCapacity] = useState(0);

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

  const handleUpdateCapacity = () => {
    axios.post('http://localhost:3001/api/settings', { newCapacity: parseInt(newCapacity) })
      .then(() => {
        alert('✅ Kapasitas Berhasil Diupdate!');
        setIsEditing(false);
        fetchData();
      })
      .catch(err => alert('❌ Gagal update kapasitas.'));
  };

  // Logika Chart (Tetap butuh logs untuk grafik)
  const chartData = useMemo(() => {
    const sortedLogs = [...data.logs].sort((a, b) => new Date(a.waktu) - new Date(b.waktu));
    const labels = [];
    const dataMasuk = [];
    const dataKeluar = [];
    let runningMasuk = 0;
    let runningKeluar = 0;

    sortedLogs.forEach(log => {
      labels.push(new Date(log.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      if (log.arah === 'MASUK') runningMasuk++;
      else runningKeluar++;
      dataMasuk.push(runningMasuk);
      dataKeluar.push(runningKeluar);
    });
    
    return {
      labels,
      datasets: [
        { label: 'Total Masuk', data: dataMasuk, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.3 },
        { label: 'Total Keluar', data: dataKeluar, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', fill: true, tension: 0.3 }
      ]
    };
  }, [data.logs]);

  const isFull = data.available <= 0;
  const mainColor = isFull ? '#ef4444' : '#10b981';

  return (
    <div className="page-content">
      <div className="stats-container">
        {/* KARTU STATUS */}
        <div className="card card-available" style={{ borderColor: isFull ? '#fca5a5' : '#86efac', background: isFull ? '#fef2f2' : '#f0fdf4' }}>
          <span className="card-label">Slot Tersedia</span>
          <span className="big-number" style={{ color: mainColor }}>{data.available}</span>
          <div className="status-chip" style={{ background: isFull ? '#fee2e2' : '#dcfce7', color: mainColor }}>
            {isFull ? "⛔ PARKIR PENUH" : "✅ TERSEDIA"}
          </div>
        </div>

        {/* KARTU KONTROL */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>⚙️ Kontrol Area</h3>
            {!isEditing && <button onClick={() => setIsEditing(true)} className="btn-link">Edit Kapasitas</button>}
          </div>
          <div style={{ marginTop: '20px' }}>
            <div className="info-row">
                <span className="info-label">Terisi</span>
                <span className="info-value">{data.filled} Unit</span>
            </div>
            
            <div style={{ marginTop: '15px' }}>
                <span className="info-label">TOTAL KAPASITAS</span>
                {isEditing ? (
                <div className="edit-controls">
                    <input type="number" value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} />
                    <button onClick={handleUpdateCapacity} className="btn-primary-small">Save</button>
                    <button onClick={() => setIsEditing(false)} className="btn-secondary-small">Cancel</button>
                </div>
                ) : (
                <h3 style={{ fontSize: '24px', margin: '5px 0' }}>{data.capacity} Slot</h3>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* GRAFIK */}
      <div className="table-card" style={{ marginTop: '20px', height: '400px' }}>
        <div style={{ padding: '20px', height: '100%' }}>
           <Line options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />
        </div>
      </div>
    </div>
  );
}

// --- 3. HALAMAN BARU: TRAFFIC LOG ACTIVITY ---
function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);

  // Fetch khusus untuk halaman Logs agar data selalu update
  useEffect(() => {
    const fetchLogs = () => {
      axios.get('http://localhost:3001/api/dashboard')
        .then(res => setLogs(res.data.logs)) 
        .catch(err => console.error(err));
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-content">
      <div className="table-card">
        <div className="table-header">
          <h3>📜 Riwayat Aktivitas Lengkap</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Real-time update traffic logs</span>
        </div>
        <table>
          <thead>
            <tr><th>Waktu Deteksi</th><th>Status Arah</th><th>Lokasi Pintu</th></tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB</td>
                  <td>
                    <span className={`badge ${log.arah === 'MASUK' ? 'badge-in' : 'badge-out'}`}>
                      {log.arah === 'MASUK' ? '⬇️ MASUK' : '⬆️ KELUAR'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{log.kode_pintu}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Belum ada data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 4. LAYOUT WRAPPER (Agar Navbar selalu muncul) ---
function Layout({ children, onLogout }) {
  return (
    <div className="dashboard-layout">
      <Navbar onLogout={onLogout} />
      {children}
    </div>
  );
}

// --- APP UTAMA DENGAN ROUTING ---
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = () => { setIsLoggedIn(true); localStorage.setItem('isLoggedIn', 'true'); };
  const handleLogout = () => { setIsLoggedIn(false); localStorage.removeItem('isLoggedIn'); };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
          
          {/* Halaman Dashboard (Grafik & Stats) */}
          <Route path="/" element={isLoggedIn ? (
            <Layout onLogout={handleLogout}>
              <DashboardPage />
            </Layout>
          ) : <Navigate to="/login" />} />

          {/* Halaman Logs (Hanya Tabel) */}
          <Route path="/logs" element={isLoggedIn ? (
            <Layout onLogout={handleLogout}>
              <ActivityLogsPage />
            </Layout>
          ) : <Navigate to="/login" />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;