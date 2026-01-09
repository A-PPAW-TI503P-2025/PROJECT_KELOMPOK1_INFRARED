import React, { useState, useEffect } from 'react';
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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  
  // 1. State untuk Filter Nomor Kamar
  const [selectedKamar, setSelectedKamar] = useState("");

  // Fungsi ambil data
  const fetchData = async () => {
    try {
      // 2. Modifikasi URL API: Tambahkan query param ?kamar=... jika ada input
      const baseUrl = 'http://localhost:3001/api/iot/history';
      const url = selectedKamar ? `${baseUrl}?kamar=${selectedKamar}` : baseUrl;

      const response = await axios.get(url);
      const dataSensor = response.data.data;

      // Siapkan sumbu X (Waktu) dan sumbu Y (Nilai)
      const labels = dataSensor.map(item => 
        new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second:'2-digit' })
      );
      
      const dataSuhu = dataSensor.map(item => item.suhu);
      const dataLembab = dataSensor.map(item => item.kelembaban);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Suhu (°C)',
            data: dataSuhu,
            borderColor: 'rgb(255, 99, 132)', // Merah
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.2, // Garis agak melengkung
          },
          {
            label: 'Kelembaban (%)',
            data: dataLembab,
            borderColor: 'rgb(53, 162, 235)', // Biru
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.2,
          },
        ],
      });
      setLoading(false);
    } catch (err) {
      console.error("Gagal ambil data sensor:", err);
      setLoading(false);
    }
  };

  // 3. Panggil data pertama kali & set Auto Refresh tiap 5 detik
  // Tambahkan [selectedKamar] di dependency array agar refresh mengikuti filter aktif
  useEffect(() => {
    fetchData(); 
    
    const interval = setInterval(() => {
      fetchData(); 
    }, 5000);

    return () => clearInterval(interval); 
  }, [selectedKamar]);

  // Opsi tampilan grafik
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true, 
        // Judul dinamis sesuai kamar yang dipilih
        text: selectedKamar ? `Monitoring Kamar: ${selectedKamar}` : 'Monitoring Seluruh Ruangan (Real-time)' 
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Monitoring Suhu Ruangan</h1>
      
      {/* 4. Bagian Input Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm flex gap-3">
        <input 
          type="text" 
          placeholder="Masukkan Nomor Kamar (Cth: A101)..." 
          value={selectedKamar}
          onChange={(e) => setSelectedKamar(e.target.value)}
          className="flex-grow border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={fetchData} 
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Cek Kamar
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center h-64">
             <p className="text-gray-500 animate-pulse">Sedang memuat data...</p>
          </div>
        ) : (
          <Line options={options} data={chartData} />
        )}
      </div>
      
    </div>
  );
}

export default SensorPage;