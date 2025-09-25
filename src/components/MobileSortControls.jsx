import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLUMNS } from "@/utils/csvUtils";

export const MobileSortControls = ({ sortColumn, sortDirection, onSort }) => {
  const currentColumn = sortColumn || COLUMNS[0];

  return (
    <div className="bg-card border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-foreground">Sort by:</span>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 min-w-[120px] justify-between"
              >
                <span className="truncate">{currentColumn}</span>
                <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              {COLUMNS.map((column) => (
                <DropdownMenuItem
                  key={column}
                  onClick={() => onSort(column)}
                  className={`cursor-pointer ${
                    sortColumn === column ? "bg-accent" : ""
                  }`}
                >
                  <span className="flex items-center justify-between w-full">
                    {column}
                    {sortColumn === column && (
                      <ArrowUpDown className="h-3 w-3 text-primary" />
                    )}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSort(currentColumn)}
            className="h-9 px-2"
          >
            {sortDirection === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
