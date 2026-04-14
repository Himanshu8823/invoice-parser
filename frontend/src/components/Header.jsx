import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <FileText className="w-5 h-5 text-white font-bold" />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">
            InvoiceAI
          </span>
        </div>
      </div>
    </header>
  );
}
