import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const INVOICE_PROMPT = `You are an expert invoice data extraction system for a CA (Chartered Accountant) firm.

Analyze the provided invoice image or PDF and extract ALL relevant data into the following strict JSON format:

{
  "invoice_number": "string or null",
  "date": "YYYY-MM-DD or null",
  "due_date": "YYYY-MM-DD or null",
  "vendor_name": "string or null",
  "vendor_address": "string or null",
  "client_name": "string or null",
  "client_address": "string or null",
  "gst_number": "string or null",
  "pan_number": "string or null",
  "subtotal": "string or null",
  "tax_amount": "string or null",
  "discount": "string or null",
  "total_amount": "string or null",
  "currency": "string or null",
  "payment_terms": "string or null",
  "items": [
    {
      "name": "string or null",
      "description": "string or null",
      "quantity": "string or null",
      "unit_price": "string or null",
      "tax_rate": "string or null",
      "price": "string or null"
    }
  ]
}

EXTRACTION RULES - IMPORTANT:
1. Extract ALL text with 100% accuracy — no approximations or guesses
2. For tax_rate: Look for percentages (e.g., "6.25%", "18% GST", "Tax Rate: 5%") at:
   a) Line item level (if shown per item)
   b) Invoice document level (if a single tax rate applies to all items)
   c) If document shows overall tax percentage (e.g., "Sales Tax 6.25%"), use that percentage for all items
   d) Return as percentage string (e.g., "6.25", "18", "5") or "6.25%" format
3. Missing fields must be null (NEVER empty string "")
4. Normalize all dates to YYYY-MM-DD format
5. Keep currency values and amounts as strings with their symbol
6. For total_amount: Include the currency symbol (e.g., "\$154.06" not "154.06")
7. Return ONLY the JSON object, no markdown, no code blocks, no explanation
8. items array must always be present (empty array if none found)
9. Do NOT hallucinate data - if something is not visible, leave as null`;

export const processInvoice = async (file) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const mimeType = file.mimetype;
  const base64Data = file.buffer.toString("base64");

  const imagePart = {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };

  const result = await model.generateContent([INVOICE_PROMPT, imagePart]);
  const response = await result.response;
  const text = response.text();

  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return parsed;
};
