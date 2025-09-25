import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/utils/csvUtils";
import { useToast } from "@/hooks/useToast";

export const ExportButton = ({ data, editedCells }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    if (data.length === 0) return;

    setIsExporting(true);

    try {
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `csv-export-${timestamp}.csv`;
      exportToCSV(data, filename);

      toast({
        variant: "success",
        title: "Export Successful",
        description: `Downloaded ${data.length.toLocaleString()} rows as ${filename}`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description:
          "There was an error exporting your CSV file. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const hasEdits = editedCells.size > 0;

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-muted-foreground">
        {hasEdits ? (
          <span className="text-warning">
            {editedCells.size} cell{editedCells.size !== 1 ? "s" : ""} edited
          </span>
        ) : (
          <span>No changes made</span>
        )}
      </div>

      <Button
        onClick={handleExport}
        disabled={data.length === 0 || isExporting}
        className="flex items-center space-x-2"
      >
        {isExporting ? (
          <>
            <div className="animate-spin">
              <FileText className="h-4 w-4" />
            </div>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </>
        )}
      </Button>
    </div>
  );
};
