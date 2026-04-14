import crypto from "crypto";

export const computeFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};
