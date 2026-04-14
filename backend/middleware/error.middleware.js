export const errorHandler = (err, req, res, next) => {
  console.error("[Error]", err.message);

  if (err.message?.includes("Invalid file type")) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.message?.includes("File too large")) {
    return res.status(400).json({ success: false, message: "File size exceeds 20MB limit." });
  }

  if (err instanceof SyntaxError) {
    return res.status(422).json({ success: false, message: "Failed to parse AI response. Please try again." });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error. Please try again.",
  });
};
