import { useState } from "react";

type ConstraintCardProps = {
  label: string;
  count: number;
  filled: number;
  total: number;
  statusGradient: string;
  onUpdate: (count: number) => void;
  onRename: (newLabel: string) => void;
  onDelete: () => void;
};

export function ConstraintCard({
  label,
  count,
  filled,
  total,
  statusGradient,
  onUpdate,
  onRename,
  onDelete,
}: ConstraintCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);

  const fillPercentage = total > 0 ? (filled / total) * 100 : 0;

  function handleSave() {
    if (editValue.trim() && editValue !== label) {
      onRename(editValue.trim());
    }
    setIsEditing(false);
  }

  function handleCancel() {
    setEditValue(label);
    setIsEditing(false);
  }

  function handleDelete() {
    if (confirm(`Delete "${label}" constraint and all its entries?`)) {
      onDelete();
    }
  }

  return (
    <div className="constraint-card">
      <div className="constraint-header">
        {isEditing ? (
          <div className="constraint-edit-row">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              className="constraint-name-input"
              autoFocus
            />
            <button onClick={handleSave} className="icon-btn save" title="Save">
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="icon-btn cancel"
              title="Cancel"
            >
              ✕
            </button>
          </div>
        ) : (
          <>
            <div className="constraint-info">
              <div className="constraint-label">{label}</div>
              <div className="constraint-stats">
                {filled} / {total} filled
              </div>
            </div>
            <div className="constraint-actions">
              <button
                onClick={() => setIsEditing(true)}
                className="icon-btn edit"
                title="Rename"
              >
                ✎
              </button>
              <button
                onClick={handleDelete}
                className="icon-btn delete"
                title="Delete"
              >
                🗑
              </button>
            </div>
          </>
        )}
      </div>

      <div className="constraint-meter">
        <div
          className="constraint-fill"
          style={{
            width: `${Math.min(100, fillPercentage)}%`,
            background: statusGradient,
          }}
        />
      </div>

      <div className="constraint-controls">
        <label className="constraint-label-text">Entries:</label>
        <input
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={count}
          onChange={(e) => onUpdate(Math.max(0, parseInt(e.target.value) || 0))}
          onBlur={(e) => {
            const n = Math.max(0, parseInt(e.currentTarget.value) || 0);
            // Ensure no leading zeros linger in UI
            e.currentTarget.value = String(n);
            onUpdate(n);
          }}
          className="constraint-number-input"
        />
      </div>
    </div>
  );
}
