// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Kita gunakan CSS yang sama

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate(); // Hook untuk pindah halaman

  const handleLogin = (e) => {
    e.preventDefault();
    // Validasi Sederhana
    if (username === 'admin' && password === 'admin123') {
      // Simpan status login ke LocalStorage (biar kalau di-refresh gak log out)
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard'); // Pindah ke halaman dashboard
    } else {
      setError('Username atau Password salah!');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>🅿️</div>
        <h2>Smart Mall Parking</h2>
        <p>Silahkan login untuk mengakses dashboard.</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="Masukkan username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Masukkan password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-login">MASUK</button>
        </form>
      </div>
    </div>
  );
}

export default Login;