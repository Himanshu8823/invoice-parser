import { processInvoice } from "../services/gemini.service.js";
import { getCache, setCache } from "../utils/cache.util.js";
import { computeFileHash } from "../utils/hash.util.js";

export const analyzeInvoice = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const fileHash = computeFileHash(req.file.buffer);

    const cached = getCache(fileHash);
    if (cached) {
      return res.json({ success: true, data: cached, fromCache: true });
    }

    const result = await processInvoice(req.file);

    setCache(fileHash, result);

    return res.json({ success: true, data: result, fromCache: false });
  } catch (error) {
    next(error);
  }
};
