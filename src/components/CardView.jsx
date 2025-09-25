import { useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { EditableCell } from "./EditableCell";
import { COLUMNS } from "@/utils/csvUtils";

const CARD_HEIGHT = 240;

export const CardView = ({ data, editedCells, onCellEdit }) => {
  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT,
  });

  const renderCard = useCallback(
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
          className="px-2 sm:px-4"
        >
          <div
            className="bg-card border border-table-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mb-4"
            style={{ height: CARD_HEIGHT - 16 }}
          >
            <div className="flex flex-col h-full space-y-3">
              {/* Title - Main field with smaller font */}
              <div className="pb-2 border-b border-muted/20">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1">
                  Title
                </label>
                <div className="font-semibold text-sm leading-tight">
                  <EditableCell
                    value={row.Title || ""}
                    onSave={(value) => onCellEdit(row.id, "Title", value)}
                    isEdited={editedCells.has(`${row.id}-Title`)}
                  />
                </div>
              </div>

              {/* Other fields in a compact 2-column grid */}
              <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                {COLUMNS.filter((col) => col !== "Title").map((column) => {
                  const cellKey = `${row.id}-${column}`;
                  const isEdited = editedCells.has(cellKey);
                  const fieldValue = row[column] || "";

                  return (
                    <div key={column} className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
                        {column}
                      </label>
                      <div className="text-xs bg-muted/10 rounded px-2 py-1.5 min-h-[1.75rem] flex items-center border border-muted/30">
                        <EditableCell
                          value={fieldValue}
                          onSave={(value) => onCellEdit(row.id, column, value)}
                          isEdited={isEdited}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [data, editedCells, onCellEdit]
  );

  if (data.length === 0) {
    return (
      <div className="bg-card border rounded-lg">
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data to display
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
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
          }}
        >
          {rowVirtualizer.getVirtualItems().map(renderCard)}
        </div>
      </div>
    </div>
  );
};
