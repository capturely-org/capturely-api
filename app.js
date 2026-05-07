const express = require("express")
const cors = require("cors")
const logger = require("./middleware/logger")

// IMAGES
const fs = require("fs")
const path = require("path")
const IMAGE_PATH = path.join("/data/images", "image.jpg");

const app = express()
app.use(express.json())
app.use(cors())
app.use(logger)


// IMAGES
app.get("/image", (req, res) => {
  if (!fs.existsSync(IMAGE_PATH)) {
    return res.status(404).send("Image not found");
  }

  res.sendFile(IMAGE_PATH);
});




app.get("/health", (req, res) => {
  res.status(200).send("OK")
})

app.get("/", (req, res) => {
  res.status(200).json({
    "ok": true,
    "message": "Welcome to capturely API",
    "creator": "Emile Sherrott"
  })
})

module.exports = app