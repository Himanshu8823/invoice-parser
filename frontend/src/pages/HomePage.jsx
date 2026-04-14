import { useState } from "react";
import { ScanLine, RotateCcw } from "lucide-react";
import { DropZone } from "../components/DropZone.jsx";
import { ProcessingLoader } from "../components/ProcessingLoader.jsx";
import { InvoiceResult } from "../components/InvoiceResult.jsx";
import { ErrorAlert } from "../components/ErrorAlert.jsx";
import { FeatureStrip } from "../components/FeatureStrip.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent } from "../components/ui/Card.jsx";
import { useInvoiceAnalysis } from "../hooks/useInvoiceAnalysis.js";

export default function HomePage() {
  const [file, setFile] = useState(null);
  const { analyze, isLoading, isSuccess, isError, data, error, fromCache, reset } =
    useInvoiceAnalysis();

  const handleFileChange = (f) => {
    setFile(f);
    if (isSuccess || isError) reset();
  };

  const handleAnalyze = () => {
    if (!file) return;
    analyze(file);
  };

  const handleReset = () => {
    setFile(null);
    reset();
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Invoice Parser
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Automatically extract data from invoices in seconds. Perfect for accountants, bookkeepers, and finance teams.
        </p>
      </div>

      {/* Feature strip */}
      <FeatureStrip />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Upload panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-2 border-blue-200 shadow-xl">
            <CardContent className="space-y-4 pt-6">
              <DropZone
                file={file}
                onFileChange={handleFileChange}
                disabled={isLoading}
              />

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold"
                  onClick={handleAnalyze}
                  disabled={!file || isLoading}
                  loading={isLoading}
                  size="lg"
                >
                  {!isLoading && <ScanLine className="w-4 h-4" />}
                  {isLoading ? "Analyzing..." : "Analyze Invoice"}
                </Button>

                {(isSuccess || isError || file) && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {isError && (
                <ErrorAlert
                  message={error}
                  onRetry={file ? handleAnalyze : undefined}
                />
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          {!isSuccess && !isLoading && (
            <div className="p-5 bg-white rounded-xl border-2 border-gray-300 space-y-3 shadow-md animate-fade-in">
              <p className="text-sm font-bold text-gray-900">
                Tips for best results
              </p>
              <ul className="space-y-2">
                {[
                  "Use high-resolution images (≥ 300 DPI)",
                  "Ensure the invoice is properly upright",
                  "PDFs with text layers work best",
                  "Avoid blurry or heavily cropped images",
                  "Process faster while maintaining consistency and accuracy",
                ].map((t) => (
                  <li key={t} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-gray-600 font-bold">→</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Results panel */}
        <div className="lg:col-span-3">
          {isLoading && <ProcessingLoader />}

          {isSuccess && data && (
            <InvoiceResult data={data} fromCache={fromCache} />
          )}

          {!isLoading && !isSuccess && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center rounded-2xl border-4 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 text-center p-12 shadow-inner">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-200 flex items-center justify-center mb-6">
                <ScanLine className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-gray-700 mb-2">
                Ready to extract
              </p>
              <p className="text-sm text-gray-500">
                Upload a PDF or image of an invoice to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
