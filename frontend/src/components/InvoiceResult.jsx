import { useState } from "react";
import {
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Zap,
  Database,
} from "lucide-react";
import { Button } from "./ui/Button.jsx";
import { Badge } from "./ui/Badge.jsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card.jsx";
import { exportToCSV, downloadJSON } from "../utils/exportUtils.js";

function MetaField({ label, value }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
        {label.replace(/_/g, " ")}
      </p>
      <p className="text-base font-semibold text-gray-900 break-words">
        {String(value)}
      </p>
    </div>
  );
}

function ItemsTable({ items }) {
  if (!items || items.length === 0) return null;

  const headers = Object.keys(items[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
              >
                {h.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, i) => (
            <tr key={i} className="hover:bg-blue-50/40 transition-colors duration-150">
              {headers.map((h) => (
                <td key={h} className="px-5 py-3.5 text-gray-800 font-medium">
                  {item[h] ?? (
                    <span className="text-gray-300 italic text-xs">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JsonViewer({ data }) {
  const [expanded, setExpanded] = useState(false);
  const jsonStr = JSON.stringify(data, null, 2);
  const lines = jsonStr.split("\n");
  const preview = lines.slice(0, 8).join("\n");
  const isTruncated = lines.length > 8;

  return (
    <div className="rounded-xl border-2 border-gray-200 overflow-hidden shadow-md bg-gray-900">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 ">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Raw JSON Data
            </span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {lines.length} lines
          </span>
        </div>
      </div>
      <div className="bg-gray-950 p-5 relative">
        <pre className="text-xs text-gray-200 font-mono overflow-x-auto scrollbar-thin leading-relaxed">
          {expanded || !isTruncated ? jsonStr : preview + "\n  ..."}
        </pre>
        {isTruncated && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors font-semibold"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> Show all {lines.length} lines
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function InvoiceResult({ data, fromCache }) {
  const [copied, setCopied] = useState(false);

  const { items = [], ...meta } = data;
  const metaFields = Object.entries(meta).filter(([, v]) => v !== null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const invoiceName =
    data.invoice_number
      ? `invoice-${data.invoice_number}`
      : "invoice-data";

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Status Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">
            Extraction Complete
          </h2>
          {fromCache && (
            <Badge variant="info">
              <Zap className="w-2.5 h-2.5" />
              Cached
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {metaFields.length} fields • {items?.length || 0} items
        </div>
      </div>

        {/* Export actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy JSON
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadJSON(data, `${invoiceName}.json`)}
          >
            <Download className="w-3.5 h-3.5" />
            JSON
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => exportToCSV(data, `${invoiceName}.csv`)}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>

      {/* Meta fields grid */}
      <Card className="shadow-lg border-2 border-gray-200">
        <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
          <CardTitle className="text-lg text-gray-900">Invoice Details</CardTitle>
          <CardDescription>All extracted metadata from the document</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metaFields.map(([key, val]) => (
              <MetaField key={key} label={key} value={val} />
            ))}
            {metaFields.length === 0 && (
              <p className="text-sm text-gray-400 col-span-3">
                No metadata fields found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Line items table */}
      {items.length > 0 && (
        <Card className="shadow-lg border-2 border-gray-200">
          <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
            <CardTitle className="text-lg text-gray-900">Line Items</CardTitle>
            <CardDescription>{items.length} item{items.length !== 1 ? "s" : ""} detected and extracted</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 px-0 pb-0 overflow-hidden rounded-b-xl">
            <ItemsTable items={items} />
          </CardContent>
        </Card>
      )}

      {/* Raw JSON */}
      <Card className="shadow-lg border-2 border-gray-200">
        <CardHeader className="bg-gray-50 border-b-2 border-gray-200">
          <CardTitle className="text-lg text-gray-900">Structured Data</CardTitle>
          <CardDescription>Complete JSON output ready for integration</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 px-4 pb-4">
          <JsonViewer data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
