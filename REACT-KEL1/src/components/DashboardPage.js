import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function DashboardPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setNama(decoded.nama || "User");
    } catch (error) {
      console.log("Token tidak valid");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">Admin Panel</h2>

        <ul className="space-y-4">
          <li className="text-gray-700 font-semibold hover:text-indigo-600 cursor-pointer">
            📊 Dashboard
          </li>
          <li className="text-gray-700 font-semibold hover:text-indigo-600 cursor-pointer">
            👤 Manajemen User
          </li>
          <li className="text-gray-700 font-semibold hover:text-indigo-600 cursor-pointer">
            📁 Data Laporan
          </li>
          <li className="text-gray-700 font-semibold hover:text-indigo-600 cursor-pointer">
            ⚙ Pengaturan
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

          <div className="flex items-center space-x-4">
            <span className="font-semibold text-gray-700">👋 Hai, {nama}</span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-indigo-600 text-lg">Total User</h3>
            <p className="text-3xl font-bold mt-2 text-gray-700">120</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-green-600 text-lg">Aktif Hari Ini</h3>
            <p className="text-3xl font-bold mt-2 text-gray-700">45</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold text-yellow-600 text-lg">Laporan Masuk</h3>
            <p className="text-3xl font-bold mt-2 text-gray-700">18</p>
          </div>

        </div>

        {/* Section Extra */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
          <h2 className="text-xl font-bold mb-3 text-gray-700">Aktivitas Terbaru</h2>

          <ul className="space-y-3">
            <li className="p-3 bg-gray-50 rounded-lg shadow-sm">
              User <b>{nama}</b> berhasil login
            </li>
            <li className="p-3 bg-gray-50 rounded-lg shadow-sm">
              Sistem melakukan backup otomatis
            </li>
            <li className="p-3 bg-gray-50 rounded-lg shadow-sm">
              Tidak ada notifikasi baru
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;


