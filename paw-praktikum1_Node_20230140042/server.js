require("dotenv").config();   

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");
const path = require('path'); 

// Impor router
const presensiRoutes = require("./Routes/presensi");
const reportRoutes = require("./Routes/reports");
const authRoutes = require("./Routes/auth");
const iotRoutes = require("./Routes/iot");


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

const ruteBuku = require("./Routes/books");
app.use("/api/books", ruteBuku);
app.use("/api/attendance", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/iot", iotRoutes);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
