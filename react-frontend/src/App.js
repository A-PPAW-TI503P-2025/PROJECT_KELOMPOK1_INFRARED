import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

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
      // Hardcode Login (Bisa diganti API nanti)
      if (username === 'admin' && password === 'admin123') {
        onLogin();
      } else {
        setError('Username atau Password salah!');
        setLoading(false);
      }
    }, 1000); // Efek loading 1 detik
  };

  return (
    <div className="login-container">
      {/* KIRI: Visual Branding */}
      <div className="login-visual">
        <div className="visual-content">
          <div className="logo-emoji">🚘</div>
          <h1 className="visual-title">Smart Mall</h1>
          <p className="visual-subtitle">Intelligent Parking System Management</p>
        </div>
      </div>

      {/* KANAN: Form Login */}
      <div className="login-form-wrapper">
        <div className="login-card">
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#1e293b' }}>Welcome Back</h2>
            <p style={{ color: '#64748b', margin: 0 }}>Please enter your details to sign in.</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', borderLeft: '4px solid #ef4444' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Admin Username</label>
              <input 
                className="input-premium"
                type="text" 
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <input 
                className="input-premium"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '30px', color: '#cbd5e1', fontSize: '12px' }}>
            © 2025 Kelompok 1 Infrared Project
          </p>
        </div>
      </div>
    </div>
  );
}

// --- 2. HALAMAN DASHBOARD ---
function DashboardPage({ onLogout }) {
  const [data, setData] = useState({ capacity: 0, filled: 0, available: 0, logs: [] });

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://localhost:3001/api/dashboard')
        .then(res => setData(res.data))
        .catch(err => console.error(err));
    };
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const isFull = data.available <= 0;
  const mainColor = isFull ? '#ef4444' : '#10b981'; // Merah atau Hijau Emerald

  return (
    <div className="dashboard-layout">
      {/* NAVBAR ATAS */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>
            🅿️ Mall Dashboard 
            <span className="live-indicator" style={{ backgroundColor: mainColor }}></span>
          </h1>
          <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '35px' }}>
            Live Monitoring System
          </span>
        </div>
        <button onClick={onLogout} className="btn-logout">Logout</button>
      </div>

      {/* GRID KARTU UTAMA */}
      <div className="stats-container">
        
        {/* KARTU 1: SLOT TERSEDIA */}
        <div className="card card-available" style={{ borderColor: isFull ? '#fca5a5' : '#86efac', background: isFull ? '#fef2f2' : '#f0fdf4' }}>
          <span className="card-label">Slot Tersedia</span>
          <span className="big-number" style={{ color: mainColor }}>
            {data.available}
          </span>
          <div className="status-chip" style={{ background: isFull ? '#fee2e2' : '#dcfce7', color: mainColor }}>
            {isFull ? "⛔ PARKIR PENUH" : "✅ TERSEDIA"}
          </div>
        </div>

        {/* KARTU 2: INFO DETAIL */}
        <div className="card">
          <h3 style={{ marginTop: 0, color: '#1e293b' }}>Statistik Area</h3>
          <div className="info-row">
            <span className="info-label">Kapasitas Total</span>
            <span className="info-value">{data.capacity} Kendaraan</span>
          </div>
          <div className="info-row">
            <span className="info-label">Sedang Parkir</span>
            <span className="info-value">{data.filled} Kendaraan</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status Sistem</span>
            <span className="info-value" style={{ color: '#3b82f6' }}>ONLINE 🟢</span>
          </div>
        </div>
      </div>

      {/* TABEL AKTIVITAS */}
      <div className="table-card">
        <div className="table-header">
          <h3>Traffic Log Activity</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Waktu Deteksi</th>
              <th>Status Arah</th>
              <th>Lokasi Pintu</th>
            </tr>
          </thead>
          <tbody>
            {data.logs.length > 0 ? (
              data.logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    {new Date(log.waktu).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {new Date(log.waktu).toLocaleDateString()}
                    </div>
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
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  Belum ada aktivitas kendaraan hari ini.
                </td>
              </tr>
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div className="App">
      {isLoggedIn ? <DashboardPage onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;