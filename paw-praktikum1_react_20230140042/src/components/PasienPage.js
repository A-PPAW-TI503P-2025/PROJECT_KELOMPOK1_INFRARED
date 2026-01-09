import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, Plus, User } from "lucide-react";

function PasienPage() {
  const [pasienList, setPasienList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: "", nama: "", nik: "", no_kamar: "", diagnosa: "", status: "Rawat Inap"
  });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchPasien = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/pasien", config);
      setPasienList(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPasien(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Hapus data pasien ini?")) {
      await axios.delete(`http://localhost:3001/api/pasien/${id}`, config);
      fetchPasien();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3001/api/pasien/${formData.id}`, formData, config);
      } else {
        await axios.post("http://localhost:3001/api/pasien", formData, config);
      }
      setShowModal(false);
      fetchPasien();
    } catch (err) { alert("Gagal menyimpan data"); }
  };

  const openModal = (data = null) => {
    if (data) {
      setIsEdit(true);
      setFormData(data);
    } else {
      setIsEdit(false);
      setFormData({ nama: "", nik: "", no_kamar: "", diagnosa: "", status: "Rawat Inap" });
    }
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Pasien</h1>
        <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} /> Tambah Pasien
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama / NIK</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kamar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pasienList.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{p.nama}</div>
                  <div className="text-sm text-gray-500">{p.nik}</div>
                </td>
                <td className="px-6 py-4 text-blue-600 font-semibold">{p.no_kamar}</td>
                <td className="px-6 py-4 text-gray-700">{p.diagnosa}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${p.status === 'Rawat Inap' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button onClick={() => openModal(p)} className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Pasien' : 'Tambah Pasien'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required type="text" placeholder="Nama Lengkap" className="w-full border p-2 rounded"
                value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
              <input required type="text" placeholder="NIK" className="w-full border p-2 rounded"
                value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} />
              <input required type="text" placeholder="Nomor Kamar (Contoh: A-101)" className="w-full border p-2 rounded"
                value={formData.no_kamar} onChange={e => setFormData({...formData, no_kamar: e.target.value})} />
              <input type="text" placeholder="Diagnosa" className="w-full border p-2 rounded"
                value={formData.diagnosa} onChange={e => setFormData({...formData, diagnosa: e.target.value})} />
              <select className="w-full border p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="Rawat Inap">Rawat Inap</option>
                <option value="Pulang">Pulang</option>
                <option value="Rujuk">Rujuk</option>
              </select>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default PasienPage;