const express = require("express");
const router = express.Router();
const cloudinary = require("../helper/cloudinary");
const upload = require("../middlewares/uploadMiddleware");
const authenticateToken = require("../middlewares/authMiddleware");
const fs = require('fs');

router.post("/image", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      msg: "Image uploaded successfully",
      data: result?.url,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
