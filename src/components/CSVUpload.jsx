import { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseCSV } from "@/utils/csvUtils";

export const CSVUpload = ({ onDataLoaded, onGenerateFakeData }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileProcess = useCallback(
    async (file) => {
      if (!file) return;

      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await parseCSV(file);
        if (data.length === 0) {
          setError("CSV file appears to be empty");
          return;
        }
        onDataLoaded(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to parse CSV file"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onDataLoaded]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFileProcess(file);
    },
    [handleFileProcess]
  );

  const handleFileSelect = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileProcess(file);
      }
    },
    [handleFileProcess]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${
            isDragOver
              ? "border-primary bg-upload-zone-active"
              : "border-border bg-upload-zone hover:bg-upload-zone-active"
          }
          ${isLoading ? "opacity-50 pointer-events-none" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="animate-spin">
              <FileText className="h-12 w-12 text-primary" />
            </div>
          ) : (
            <Upload className="h-12 w-12 text-muted-foreground" />
          )}

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isLoading ? "Processing CSV..." : "Upload CSV File"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your CSV file here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Expected columns: Title, Author, Genre, PublishedYear, ISBN
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Don't have a CSV file? Generate sample data instead
        </p>
        <Button
          onClick={onGenerateFakeData}
          variant="outline"
          disabled={isLoading}
        >
          Generate 10,000 Sample Books
        </Button>
      </div>
    </div>
  );
};
