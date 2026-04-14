export const convertToCSV = (data) => {
  const { items = [], ...meta } = data;

  const metaHeaders = Object.keys(meta).filter((k) => k !== "items");

  if (items.length === 0) {
    const headers = metaHeaders.join(",");
    const values = metaHeaders.map((h) => escapeCSV(meta[h])).join(",");
    return `${headers}\n${values}`;
  }

  const itemHeaders = Object.keys(items[0] || {});
  const allHeaders = [...metaHeaders, ...itemHeaders.map((h) => `item_${h}`)];

  const rows = items.map((item) => {
    const metaValues = metaHeaders.map((h) => escapeCSV(meta[h]));
    const itemValues = itemHeaders.map((h) => escapeCSV(item[h]));
    return [...metaValues, ...itemValues].join(",");
  });

  return [allHeaders.join(","), ...rows].join("\n");
};

const escapeCSV = (value) => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};
