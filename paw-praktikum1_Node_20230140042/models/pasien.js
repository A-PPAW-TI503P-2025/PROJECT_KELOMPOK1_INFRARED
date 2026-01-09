'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pasien = sequelize.define('Pasien', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    umur: DataTypes.INTEGER,
    alamat: DataTypes.TEXT,
    no_kamar: {
      type: DataTypes.STRING,
      allowNull: false
    },
    diagnosa: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Rawat Inap', 'Pulang', 'Rujuk'),
      defaultValue: 'Rawat Inap'
    }
  });
  return Pasien;
};