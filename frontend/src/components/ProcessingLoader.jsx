import { useEffect, useState } from "react";
import { cn } from "../lib/utils.js";

const MESSAGES = [
  { text: "Uploading document…" },
  { text: "Analyzing invoice structure…" },
  { text: "Extracting structured data…" },
  { text: "Parsing line items…" },
  { text: "Normalizing fields…" },
  { text: "Almost done…" },
];

function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400%_100%] rounded-md",
        className
      )}
      style={{
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
    />
  );
}

export function ProcessingLoader() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 200);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const current = MESSAGES[msgIndex];

  return (
    <div className="space-y-5 animate-fade-in">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Status message */}
      <div className="flex items-center gap-3 p-4 bg-brand-50 rounded-xl border border-brand-100">
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-brand-500 animate-spin" />
        </div>
        <div
          className="transition-opacity duration-200"
          style={{ opacity: fade ? 1 : 0 }}
        >
          <p className="text-sm font-medium text-brand-700">{current.text}</p>
        </div>
      </div>

      {/* Skeleton preview */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-5 w-full rounded" />
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-16 rounded" />
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <Skeleton className="h-8 w-full rounded-none" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-full rounded-none mt-px" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
