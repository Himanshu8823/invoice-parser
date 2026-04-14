import { useCallback, useRef, useState } from "react";
import { Upload, FileText, Image, X, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils.js";
import { Button } from "./ui/Button.jsx";

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

const MAX_SIZE_MB = 20;

function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith("image/");
  const [previewUrl] = useState(() =>
    isImage ? URL.createObjectURL(file) : null
  );

  const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-slide-up">
      <div className="w-10 h-10 rounded-md overflow-hidden bg-white border border-gray-200 flex items-center justify-center shrink-0">
        {isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {sizeInMB} MB · {file.type.split("/")[1].toUpperCase()}
        </p>
      </div>

      <button
        onClick={onRemove}
        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function DropZone({ file, onFileChange, disabled }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const validateFile = (f) => {
    if (!Object.keys(ACCEPTED_TYPES).includes(f.type)) {
      return "Invalid file type. Please upload a JPG, PNG, WEBP, or PDF file.";
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File exceeds ${MAX_SIZE_MB}MB limit.`;
    }
    return null;
  };

  const handleFile = useCallback(
    (f) => {
      const err = validateFile(f);
      if (err) {
        setValidationError(err);
        return;
      }
      setValidationError(null);
      onFileChange(f);
    },
    [onFileChange]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e) => {
    const f = e.target.files[0];
    if (f) handleFile(f);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {!file ? (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group",
            isDragging
              ? "border-brand-500 bg-brand-50"
              : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                isDragging
                  ? "bg-brand-100 text-brand-600"
                  : "bg-white border border-gray-200 text-gray-400 group-hover:border-gray-300 group-hover:text-gray-500"
              )}
            >
              <Upload className="w-5 h-5" />
            </div>

            <p className="text-sm font-medium text-gray-700">
              {isDragging ? "Drop your file here" : "Drop invoice here or click to browse"}
            </p>
            <p className="text-xs text-gray-400 mt-1.5">
              Supports PDF, JPG, PNG, WEBP · Max {MAX_SIZE_MB}MB
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,.pdf"
            onChange={onInputChange}
          />
        </div>
      ) : (
        <FilePreview file={file} onRemove={() => onFileChange(null)} />
      )}

      {validationError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-xs text-red-600">{validationError}</p>
        </div>
      )}
    </div>
  );
}
