import { cn } from "../../lib/utils.js";

const variants = {
  default: "bg-gray-100 text-gray-600",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  warning: "bg-amber-50 text-amber-700 border border-amber-100",
  error: "bg-red-50 text-red-600 border border-red-100",
  info: "bg-blue-50 text-blue-700 border border-blue-100",
  brand: "bg-brand-50 text-brand-700 border border-brand-100",
};

export function Badge({ children, variant = "default", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
