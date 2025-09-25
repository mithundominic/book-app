import { useState, useCallback, useMemo } from "react";
import { RotateCcw, FileSpreadsheet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CSVUpload } from "./CSVUpload";
import { VirtualizedTable } from "./VirtualizedTable";
import { FilterBar } from "./FilterBar";
import { ExportButton } from "./ExportButton";
import { generateFakeData, filterData } from "@/utils/csvUtils";
import { useToast } from "@/hooks/useToast";
import { useResponsive } from "@/hooks/useResponsive";

export const CSVEditor = () => {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [editedCells, setEditedCells] = useState(new Set());
  const [filters, setFilters] = useState({});
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const { toast } = useToast();
  const { isMobile } = useResponsive();

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return filterData(data, filters);
  }, [data, filters]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn] || "";
      const bValue = b[sortColumn] || "";

      let comparison = 0;
      if (sortColumn === "PublishedYear") {
        comparison = parseInt(aValue) - parseInt(bValue);
      } else {
        comparison = aValue.localeCompare(bValue);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleDataLoaded = useCallback(
    (newData) => {
      setOriginalData(newData);
      setData(newData);
      setEditedCells(new Set());
      setFilters({});
      setSortColumn(null);
      setSortDirection("asc");

      toast({
        variant: "success",
        title: "CSV Loaded Successfully",
        description: `Loaded ${newData.length.toLocaleString()} rows`,
      });
    },
    [toast]
  );

  const handleGenerateFakeData = useCallback(() => {
    const fakeData = generateFakeData(10000);
    handleDataLoaded(fakeData);
  }, [handleDataLoaded]);

  const handleCellEdit = useCallback((rowId, column, value) => {
    setData((currentData) =>
      currentData.map((row) =>
        row.id === rowId ? { ...row, [column]: value } : row
      )
    );

    setEditedCells((current) => {
      const newSet = new Set(current);
      newSet.add(`${rowId}-${column}`);
      return newSet;
    });
  }, []);

  const handleFilterChange = useCallback((column, value) => {
    setFilters((current) => ({
      ...current,
      [column]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleSort = useCallback(
    (column) => {
      if (sortColumn === column) {
        setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
    },
    [sortColumn]
  );

  const handleResetEdits = useCallback(() => {
    setData(originalData);
    setEditedCells(new Set());
    toast({
      variant: "warning",
      title: "Changes Reset",
      description: "All edits have been reverted to original data",
    });
  }, [originalData, toast]);

  const handleDeleteFile = useCallback(() => {
    setOriginalData([]);
    setData([]);
    setEditedCells(new Set());
    setFilters({});
    setSortColumn(null);
    setSortDirection("asc");
    toast({
      variant: "destructive",
      title: "File Deleted",
      description: "CSV file has been removed. You can upload a new file.",
    });
  }, [toast]);

  const hasData = data.length > 0;
  const hasEdits = editedCells.size > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <FileSpreadsheet className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">CSV Editor</h1>
            <p className="text-muted-foreground">
              Upload, edit, filter, and export large CSV files with ease
            </p>
          </div>
        </div>

        {/* Upload Section */}
        {!hasData && (
          <CSVUpload
            onDataLoaded={handleDataLoaded}
            onGenerateFakeData={handleGenerateFakeData}
          />
        )}

        {/* Data Management Section */}
        {hasData && (
          <div className="space-y-6">
            {/* File Status */}
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">
                      CSV File Loaded
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {data.length.toLocaleString()} rows •{" "}
                      {hasEdits
                        ? `${editedCells.size} edited cells`
                        : "No edits"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-card border rounded-lg">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleDeleteFile}
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete File
                </Button>

                {hasEdits && (
                  <Button
                    onClick={handleResetEdits}
                    variant="outline"
                    size="sm"
                    className="text-warning hover:text-warning-foreground"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset All Edits
                  </Button>
                )}
              </div>

              <ExportButton data={sortedData} editedCells={editedCells} />
            </div>

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              totalRows={data.length}
              filteredRows={filteredData.length}
            />

            {/* Data Table */}
            <VirtualizedTable
              data={sortedData}
              editedCells={editedCells}
              onCellEdit={handleCellEdit}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />

            {/* Footer Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                {isMobile
                  ? "Tap any cell to edit • Use filters to narrow down data • Use sort controls above"
                  : "Double-click any cell to edit • Use filters to narrow down data • Click column headers to sort"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
