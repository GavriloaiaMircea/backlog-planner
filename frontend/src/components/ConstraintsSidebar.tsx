import { useMemo } from "react";
import type { GamePlanSlot } from "../types";

type Constraint = { label: string; count: number };

type Props = {
  selectedMonth: string;
  slots: GamePlanSlot[];
  constraints: Constraint[];
  onUpdateConstraint?: (label: string, count: number) => void;
};

export function ConstraintsSidebar({
  selectedMonth,
  slots,
  constraints,
  onUpdateConstraint,
}: Props) {
  const stats = useMemo(() => {
    const byLabel = new Map<string, { total: number; filled: number }>();
    const monthSlots = slots.filter((s) => s.month === selectedMonth);

    for (const s of monthSlots) {
      const key = normalizeLabel(s.slotType);
      const current = byLabel.get(key) ?? { total: 0, filled: 0 };
      current.total++;
      if (s.title) current.filled++;
      byLabel.set(key, current);
    }
    return byLabel;
  }, [slots, selectedMonth]);

  function setConstraint(label: string, count: number) {
    onUpdateConstraint?.(label, count);
  }

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Month Constraints</h2>
      <p className="sidebar-subtitle">
        Set how many slots you want for each type. Slots update automatically.
      </p>
      <div className="sidebar-list">
        {constraints.map((c) => {
          const key = normalizeLabel(c.label);
          const stat = stats.get(key) ?? { total: 0, filled: 0 };
          const fillPercentage =
            stat.total > 0 ? (stat.filled / stat.total) * 100 : 0;
          return (
            <div className="constraint-row" key={c.label}>
              <div className="constraint-label">{c.label}</div>
              <div className="constraint-meter">
                <div
                  className="constraint-fill"
                  style={{
                    width: `${Math.min(100, fillPercentage)}%`,
                  }}
                />
              </div>
              <div className="constraint-count">
                {stat.filled} / {stat.total}
              </div>
              <input
                type="number"
                min={0}
                value={c.count}
                onChange={(e) =>
                  setConstraint(
                    c.label,
                    Math.max(0, parseInt(e.target.value) || 0)
                  )
                }
                className="constraint-input"
              />
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function normalizeLabel(label: string) {
  // Normalize so 'PC 1', 'PC 2', 'PC 3' all count under 'PC'
  if (label.startsWith("PC")) return "PC";
  if (label.toLowerCase().includes("co-op")) return "Co-op";
  if (label.toLowerCase().includes("steam deck")) return "Steam Deck";
  return label;
}
