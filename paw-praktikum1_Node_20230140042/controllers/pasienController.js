const { Pasien } = require("../models");
const { Op } = require("sequelize");

// GET ALL (Bisa search nama)
exports.getAllPasien = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};
    
    if (search) {
      whereClause.nama = { [Op.like]: `%${search}%` };
    }

    const data = await Pasien.findAll({ where: whereClause, order: [['updatedAt', 'DESC']] });
    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE
exports.createPasien = async (req, res) => {
  try {
    await Pasien.create(req.body);
    res.status(201).json({ message: "Pasien berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE
exports.updatePasien = async (req, res) => {
  try {
    const pasien = await Pasien.findByPk(req.params.id);
    if (!pasien) return res.status(404).json({ message: "Pasien tidak ditemukan" });
    
    await pasien.update(req.body);
    res.json({ message: "Data pasien diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
exports.deletePasien = async (req, res) => {
  try {
    const pasien = await Pasien.findByPk(req.params.id);
    if (!pasien) return res.status(404).json({ message: "Pasien tidak ditemukan" });

    await pasien.destroy();
    res.json({ message: "Pasien dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};