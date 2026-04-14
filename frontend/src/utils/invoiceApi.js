import apiClient from "../lib/apiClient.js";

export const analyzeInvoiceAPI = async (file) => {
  const formData = new FormData();
  formData.append("invoice", file);

  const { data } = await apiClient.post("/invoices/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};
