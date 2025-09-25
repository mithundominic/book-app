import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { COLUMNS } from "@/utils/csvUtils";

export const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
  totalRows,
  filteredRows,
}) => {
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Filter Data</h3>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Showing {filteredRows.toLocaleString()} of{" "}
            {totalRows.toLocaleString()} rows
          </span>

          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {COLUMNS.map((column) => (
          <div key={column} className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {column}
            </label>
            <Input
              placeholder={`Filter by ${column.toLowerCase()}...`}
              value={filters[column] || ""}
              onChange={(e) => onFilterChange(column, e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
