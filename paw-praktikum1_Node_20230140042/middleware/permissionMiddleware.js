const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// ====================================================================
// Middleware: Autentikasi Token (Wajib untuk semua user)
// ====================================================================
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek apakah header Authorization ada
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token tidak disediakan. Silakan login kembali."
    });
  }

  const token = authHeader.split(" ")[1];

  // Verifikasi token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token tidak valid atau sudah kedaluwarsa."
      });
    }

    // Simpan payload user ke req.user
    req.user = decoded;
    next();  
  });
};

// ====================================================================
// Middleware: Hanya Admin yang boleh akses
// ====================================================================
exports.isAdmin = (req, res, next) => {
  // Pastikan token sudah diverifikasi oleh authenticateToken
  if (!req.user) {
    return res.status(401).json({
      message: "User belum terotentikasi."
    });
  }

  // Cek role admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Akses ditolak. Hanya admin yang diizinkan."
    });
  }

  next(); 
};
