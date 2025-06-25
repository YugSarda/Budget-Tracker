import express from 'express';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

router.post("/scan", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(path.resolve(filePath)));
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");
    formData.append("apikey", process.env.OCR_API_KEY);

    const response = await axios.post("https://api.ocr.space/parse/image", formData, {
      headers: {
        ...formData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    fs.unlink(filePath, () => {}); // async cleanup

    const parsedText = response.data?.ParsedResults?.[0]?.ParsedText || "";
    res.json({ text: parsedText });
  } catch (err) {
    console.error("OCR error", err.message || err);
    res.status(500).json({ error: "OCR processing failed" });
  }
});

export default router;
