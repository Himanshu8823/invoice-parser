import { Router } from "express";
import multer from "multer";
import { analyzeInvoice } from "../controllers/invoice.controller.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed."));
    }
  },
});

router.post("/analyze", upload.single("invoice"), analyzeInvoice);

export default router;
