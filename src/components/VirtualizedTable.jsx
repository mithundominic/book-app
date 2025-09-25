import { useMemo, useCallback, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { EditableCell } from "./EditableCell";
import { CardView } from "./CardView";
import { MobileSortControls } from "./MobileSortControls";
import { useResponsive } from "@/hooks/useResponsive";
import { ArrowUpDown } from "lucide-react";
import { COLUMNS } from "@/utils/csvUtils";

const COLUMN_FLEX = {
  Title: "3",
  Author: "2.5",
  Genre: "1.5",
  PublishedYear: "1.2",
  ISBN: "1.8",
};

const ROW_HEIGHT = 50;
const HEADER_HEIGHT = 50;

export const VirtualizedTable = ({
  data,
  editedCells,
  onCellEdit,
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const { isMobile } = useResponsive();
  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
  });

  // Calculate minimum width needed for content
  const minTableWidth = useMemo(() => {
    return 800;
  }, []);

  const renderHeader = () => (
    <div
      className="flex bg-table-header border-b-2 border-table-border sticky top-0 z-10 w-full"
      style={{ height: HEADER_HEIGHT }}
    >
      {COLUMNS.map((column) => (
        <div
          key={column}
          className="flex items-center justify-between px-4 py-3 border-r border-table-border cursor-pointer hover:bg-muted/50 transition-colors"
          style={{
            flex: COLUMN_FLEX[column],
            minWidth:
              column === "Title"
                ? "200px"
                : column === "ISBN"
                ? "140px"
                : "100px",
          }}
          onClick={() => onSort(column)}
        >
          <span className="font-semibold text-foreground text-sm">
            {column}
          </span>
          <ArrowUpDown
            className={`h-3 w-3 ml-2 flex-shrink-0 transition-colors ${
              sortColumn === column ? "text-primary" : "text-muted-foreground"
            }`}
          />
        </div>
      ))}
    </div>
  );

  const renderRow = useCallback(
    (virtualRow) => {
      const row = data[virtualRow.index];

      return (
        <div
          key={virtualRow.key}
          data-index={virtualRow.index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${virtualRow.size}px`,
            transform: `translateY(${virtualRow.start}px)`,
          }}
          className={`flex hover:bg-table-row-hover transition-colors ${
            virtualRow.index % 2 === 0
              ? "bg-table-row-even"
              : "bg-table-row-odd"
          }`}
        >
          {COLUMNS.map((column) => {
            const cellKey = `${row.id}-${column}`;
            const isEdited = editedCells.has(cellKey);

            return (
              <div
                key={column}
                className="border-r border-b border-table-border"
                style={{
                  flex: COLUMN_FLEX[column],
                  minWidth:
                    column === "Title"
                      ? "200px"
                      : column === "ISBN"
                      ? "140px"
                      : "100px",
                }}
              >
                <EditableCell
                  value={row[column]}
                  onSave={(value) => onCellEdit(row.id, column, value)}
                  isEdited={isEdited}
                />
              </div>
            );
          })}
        </div>
      );
    },
    [data, editedCells, onCellEdit]
  );

  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-lg">
        {!isMobile && renderHeader()}
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data to display
        </div>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-4">
        <MobileSortControls
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <CardView
          data={data}
          editedCells={editedCells}
          onCellEdit={onCellEdit}
        />
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="bg-card border rounded-lg overflow-hidden w-full">
      <div className="overflow-x-auto" style={{ minWidth: minTableWidth }}>
        {renderHeader()}
        <div
          ref={parentRef}
          className="overflow-auto"
          style={{ height: "600px" }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
              minWidth: minTableWidth,
            }}
          >
            {rowVirtualizer.getVirtualItems().map(renderRow)}
          </div>
        </div>
      </div>
    </div>
  );
};
