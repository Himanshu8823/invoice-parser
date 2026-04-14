export const exportToCSV = (data, filename = "invoice-data.csv") => {
  const { items = [], ...meta } = data;

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const metaHeaders = Object.keys(meta).filter((k) => k !== "items");

  let csvContent = "";

  if (items.length === 0) {
    const headers = metaHeaders.join(",");
    const values = metaHeaders.map((h) => escapeCSV(meta[h])).join(",");
    csvContent = `${headers}\n${values}`;
  } else {
    const itemHeaders = Object.keys(items[0] || {});
    const allHeaders = [
      ...metaHeaders,
      ...itemHeaders.map((h) => `item_${h}`),
    ];

    const rows = items.map((item) => {
      const metaValues = metaHeaders.map((h) => escapeCSV(meta[h]));
      const itemValues = itemHeaders.map((h) => escapeCSV(item[h]));
      return [...metaValues, ...itemValues].join(",");
    });

    csvContent = [allHeaders.join(","), ...rows].join("\n");
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadJSON = (data, filename = "invoice-data.json") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const computeFileHash = async (file) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
