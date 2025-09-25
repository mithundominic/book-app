import { useState, useCallback, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

export const EditableCell = ({ value, onSave, isEdited = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  }, [editValue, value, onSave]);

  const handleCancel = useCallback(() => {
    setEditValue(value);
    setIsEditing(false);
  }, [value]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleClick = useCallback(() => {
    // On mobile, single click to edit for better UX
    if (window.innerWidth < 1024) {
      setIsEditing(true);
    }
  }, []);

  const handleBlur = useCallback(() => {
    handleSave();
  }, [handleSave]);

  if (isEditing) {
    return (
      <div className="w-full h-full bg-table-cell-editing">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="h-full border-0 bg-transparent focus:ring-2 focus:ring-primary/50 rounded-none text-sm"
        />
      </div>
    );
  }

  return (
    <div
      className={`
        w-full h-full px-3 py-2 cursor-pointer select-none
        hover:bg-table-row-hover transition-colors duration-150
        ${isEdited ? "bg-success/10 border-l-2 border-l-success" : ""}
        lg:cursor-pointer break-words
      `}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      title={
        window.innerWidth < 1024
          ? `${value} (Tap to edit)`
          : `${value} (Double-click to edit)`
      }
    >
      <span className="block w-full">{value || "-"}</span>
    </div>
  );
};
