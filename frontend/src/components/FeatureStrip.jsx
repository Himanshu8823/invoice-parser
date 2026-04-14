import { Brain, Zap, FileSearch, Download } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    label: "AI Extraction",
    desc: "Intelligent data extraction technology",
  },
  {
    icon: Zap,
    label: "Smart Caching",
    desc: "Same file = instant cached results",
  },
  {
    icon: FileSearch,
    label: "Compliance Ready",
    desc: "Built for Indian invoicing standards",
  },
  {
    icon: Download,
    label: "Easy Export",
    desc: "Download as JSON or CSV",
  },
];

export function FeatureStrip() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {FEATURES.map(({ icon: Icon, label, desc }) => (
        <div
          key={label}
          className="relative p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 rounded-xl transition-all duration-300" />
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 group-hover:shadow-md transition-all">
              <Icon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-3">{label}</p>
            <p className="text-xs text-gray-600 mt-1.5">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
