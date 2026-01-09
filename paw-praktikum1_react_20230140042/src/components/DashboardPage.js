import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Dibiarkan tetap ada, meskipun tidak digunakan dalam tampilan ini

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  return (
    // 1. Mengubah latar belakang menjadi lebih terang (bg-indigo-50) dan menambahkan padding vertikal
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-center p-4"> 
      
      {/* 2. Kartu Konten Utama */}
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl transition duration-500 hover:shadow-2xl border border-indigo-100"> 
        
        {/* Header Sukses */}
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 tracking-tight">
          ✅ Login Sukses!
        </h1>
        
        {/* Deskripsi */}
        <p className="text-lg text-gray-600 mb-8 border-b pb-4">
          Selamat Datang di Halaman Dashboard Anda.
        </p>

      
        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          // Styling Tombol yang lebih menawan
          className="w-full py-3 px-6 bg-red-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-red-700 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-red-300"
        >
          {/* Menambahkan Ikon Logout */}
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout Akun
          </span>
        </button>
      </div>

    </div>
  );
}

export default DashboardPage;