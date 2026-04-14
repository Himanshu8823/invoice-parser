import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/Button.jsx";

export function ErrorAlert({ message, onRetry }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100 animate-fade-in">
      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-700">Analysis failed</p>
        <p className="text-xs text-red-500 mt-0.5 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}
