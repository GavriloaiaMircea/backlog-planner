import { useMemo } from "react";
import type { GamePlanSlot, Status } from "../types";
import { statusOptions } from "../data/mock";

type Props = {
  slots: GamePlanSlot[];
  months: string[];
  onChange?: (updated: GamePlanSlot) => void;
};

export function PlannerGrid({ slots, months, onChange }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<string, GamePlanSlot[]>();
    for (const m of months) map.set(m, []);
    for (const s of slots) {
      const arr = map.get(s.month) || [];
      arr.push(s);
      arr.sort((a, b) => a.slotType.localeCompare(b.slotType));
      map.set(s.month, arr);
    }
    return map;
  }, [slots, months]);

  function updateSlot(id: string, patch: Partial<GamePlanSlot>) {
    const slot = slots.find((s) => s.id === id);
    if (slot && onChange) {
      onChange({ ...slot, ...patch });
    }
  }

  return (
    <div className="grid-wrapper">
      <table className="grid-table">
        <thead>
          <tr>
            <th className="grid-th">Month</th>
            <th className="grid-th">Slot</th>
            <th className="grid-th">Game Title</th>
            <th className="grid-th">Status</th>
            <th className="grid-th">Rating (1-10)</th>
            <th className="grid-th">Note</th>
          </tr>
        </thead>
        <tbody>
          {[...grouped.entries()].map(([month, monthSlots]) =>
            monthSlots.map((s) => (
              <tr key={s.id} className="grid-row">
                <td className="grid-td month-cell">{monthLabel(month)}</td>
                <td className="grid-td slot-cell">{s.slotType}</td>
                <td className="grid-td">
                  <input
                    value={s.title ?? ""}
                    placeholder="Enter game title"
                    onChange={(e) =>
                      updateSlot(s.id, { title: e.target.value })
                    }
                    className="grid-input"
                  />
                </td>
                <td className="grid-td">
                  <select
                    value={s.status ?? "Backlog"}
                    onChange={(e) =>
                      updateSlot(s.id, { status: e.target.value as Status })
                    }
                    className="grid-select"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="grid-td">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={s.rating ?? ""}
                    onChange={(e) =>
                      updateSlot(s.id, {
                        rating:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                    className="grid-input"
                  />
                </td>
                <td className="grid-td">
                  <input
                    value={s.note ?? ""}
                    placeholder="Notes"
                    onChange={(e) => updateSlot(s.id, { note: e.target.value })}
                    className="grid-input"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function monthLabel(m: string) {
  const [y, mm] = m.split("-");
  const date = new Date(Number(y), Number(mm) - 1, 1);
  // Force English month names
  return date.toLocaleString("en-US", { month: "long" });
}

// Using CSS classes defined in App.css for a cleaner, modern look
