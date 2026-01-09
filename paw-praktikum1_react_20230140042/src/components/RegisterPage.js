import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Users, LogIn, Loader2, UserPlus } from 'lucide-react';

function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'mahasiswa' 
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); 

      if (response.ok) {
        setMessage('Registrasi Berhasil! Anda akan diarahkan ke halaman login dalam 3 detik.');
        setIsSuccess(true);
        // Arahkan ke login setelah 3 detik
        setTimeout(() => navigate('/login'), 3000); 
      } else {
        setMessage(data.message || 'Registrasi Gagal. Mohon periksa kembali data Anda.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Terjadi kesalahan pada server. Coba lagi nanti.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-500 border-t-8 border-blue-600">
        
        {/* Header Bagian Atas */}
        <div className="bg-gray-50 px-8 py-8 border-b border-gray-100 flex flex-col items-center">
            <UserPlus className="h-12 w-12 text-blue-600 mb-2" />
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                Buat Akun Baru
            </h2>
            <p className="text-center text-gray-500 mt-2 text-sm">
                Daftar untuk mengakses sistem informasi akademik
            </p>
        </div>

        {/* Form Section */}
        <div className="p-8">

          {/* Pesan Notifikasi */}
          {message && (
            <div 
              className={`border px-4 py-3 rounded-lg mb-6 transition-all duration-300 ${isSuccess ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`} 
              role="alert"
            >
              <span className="block sm:inline">{message}</span>
            </div>
          )}
        
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Nama Lengkap */}
            <div className="space-y-2">
              <label htmlFor="nama" className="text-sm font-medium text-gray-700 tracking-wide flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-500" /> Nama Lengkap
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 shadow-sm"
                placeholder="Nama sesuai KTP/NIM"
                required
              />
            </div>

            {/* Input Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 tracking-wide flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-500" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 shadow-sm"
                placeholder="email@universitas.ac.id"
                required
              />
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 tracking-wide flex items-center">
                <Lock className="h-4 w-4 mr-2 text-blue-500" /> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 shadow-sm"
                placeholder="Buat password yang kuat"
                required
              />
            </div>

            {/* Dropdown Role */}
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700 tracking-wide flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" /> Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition duration-200 shadow-sm bg-white"
              >
                <option value="mahasiswa">Mahasiswa</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Tombol Daftar */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white transition duration-300 ease-in-out
                ${isLoading || isSuccess
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-1'}`
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Daftar Sekarang</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-150">
              Login disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;