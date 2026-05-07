const express = require("express");
const cors = require("cors");
const multer = require("multer");
const logger = require("./middleware/logger");

const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

// 🧠 Paths
const DEFAULT_IMAGE = path.join("/data/images", "image.jpg");
const UPLOAD_DIR = "/data/images/uploads";

// 📁 Ensure uploads folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 📦 Multer config (uploads ONLY)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🖼 Serve ONLY default image
app.get("/images", (req, res) => {
  if (!fs.existsSync(DEFAULT_IMAGE)) {
    return res.status(404).send("Default image not found");
  }

  res.sendFile(DEFAULT_IMAGE);
});

// 📥 Upload images (archive only)
app.post("/images", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(201).json({
    message: "Image stored successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
});

// 🩺 health
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// 🏠 root
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Welcome to capturely API",
    creator: "Emile Sherrott",
  });
});

module.exports = app;