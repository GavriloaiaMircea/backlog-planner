import { useMemo } from "react";
import type { GamePlanSlot } from "../types";
import { ConstraintCard } from "./ConstraintCard";
import { AddConstraint } from "./AddConstraint";

type Constraint = { label: string; count: number };

type Props = {
  selectedMonth: string;
  slots: GamePlanSlot[];
  constraints: Constraint[];
  onUpdateConstraint?: (label: string, count: number) => void;
  onRenameConstraint?: (oldLabel: string, newLabel: string) => void;
  onDeleteConstraint?: (label: string) => void;
  onAddConstraint?: (label: string) => void;
};

export function ConstraintsSidebar({
  selectedMonth,
  slots,
  constraints,
  onUpdateConstraint,
  onRenameConstraint,
  onDeleteConstraint,
  onAddConstraint,
}: Props) {
  const stats = useMemo(() => {
    const byLabel = new Map<
      string,
      {
        total: number;
        filled: number;
        playing: number;
        completed: number;
        dropped: number;
        backlog: number;
      }
    >();
    const monthSlots = slots.filter((s) => s.month === selectedMonth);

    for (const s of monthSlots) {
      const key = normalizeLabel(s.slotType);
      const current = byLabel.get(key) ?? {
        total: 0,
        filled: 0,
        playing: 0,
        completed: 0,
        dropped: 0,
        backlog: 0,
      };
      current.total++;
      if (s.title) {
        current.filled++;
        const status = s.status?.toLowerCase() || "backlog";
        if (status === "playing") current.playing++;
        else if (status === "completed") current.completed++;
        else if (status === "dropped") current.dropped++;
        else current.backlog++;
      }
      byLabel.set(key, current);
    }
    return byLabel;
  }, [slots, selectedMonth]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Month Constraints</h2>
        <p className="sidebar-subtitle">
          Set how many entries you want for each type. Entries update
          automatically.
        </p>
      </div>

      <div className="sidebar-list">
        {constraints.map((c) => {
          const key = normalizeLabel(c.label);
          const stat = stats.get(key) ?? {
            total: 0,
            filled: 0,
            playing: 0,
            completed: 0,
            dropped: 0,
            backlog: 0,
          };
          const gradientColor = getStatusGradient(stat);

          return (
            <ConstraintCard
              key={c.label}
              label={c.label}
              count={c.count}
              filled={stat.filled}
              total={stat.total}
              statusGradient={gradientColor}
              onUpdate={(count) => onUpdateConstraint?.(c.label, count)}
              onRename={(newLabel) => onRenameConstraint?.(c.label, newLabel)}
              onDelete={() => onDeleteConstraint?.(c.label)}
            />
          );
        })}

        <AddConstraint onAdd={(name) => onAddConstraint?.(name)} />
      </div>
    </aside>
  );
}

function normalizeLabel(label: string) {
  if (label.startsWith("PC")) return "PC";
  if (label.toLowerCase().includes("co-op")) return "Co-op";
  if (label.toLowerCase().includes("steam deck")) return "Steam Deck";
  return label;
}

function getStatusGradient(stat: {
  filled: number;
  playing: number;
  completed: number;
  dropped: number;
  backlog: number;
}): string {
  if (stat.filled === 0) {
    return "linear-gradient(90deg, #4dd9c0, #6d8aff)";
  }

  const playingPct = stat.playing / stat.filled;
  const completedPct = stat.completed / stat.filled;
  const droppedPct = stat.dropped / stat.filled;
  const backlogPct = stat.backlog / stat.filled;

  const colors = {
    playing: "#6d8aff",
    completed: "#50d890",
    dropped: "#ff6b7a",
    backlog: "#ffb54d",
  };

  if (completedPct === 1) {
    return `linear-gradient(90deg, #3ec87a, ${colors.completed})`;
  }
  if (droppedPct === 1) {
    return `linear-gradient(90deg, #ff5566, ${colors.dropped})`;
  }
  if (playingPct === 1) {
    return `linear-gradient(90deg, #5a73d9, ${colors.playing})`;
  }
  if (backlogPct === 1) {
    return `linear-gradient(90deg, #ffa73d, ${colors.backlog})`;
  }

  const gradientStops: string[] = [];
  let position = 0;

  if (completedPct > 0) {
    gradientStops.push(`${colors.completed} ${position}%`);
    position += completedPct * 100;
    gradientStops.push(`${colors.completed} ${position}%`);
  }
  if (playingPct > 0) {
    gradientStops.push(`${colors.playing} ${position}%`);
    position += playingPct * 100;
    gradientStops.push(`${colors.playing} ${position}%`);
  }
  if (backlogPct > 0) {
    gradientStops.push(`${colors.backlog} ${position}%`);
    position += backlogPct * 100;
    gradientStops.push(`${colors.backlog} ${position}%`);
  }
  if (droppedPct > 0) {
    gradientStops.push(`${colors.dropped} ${position}%`);
    position += droppedPct * 100;
    gradientStops.push(`${colors.dropped} ${position}%`);
  }

  return `linear-gradient(90deg, ${gradientStops.join(", ")})`;
}
