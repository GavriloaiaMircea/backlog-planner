import "./styles/App.css";
import "./styles/Hero.css";
import "./styles/Panel.css";
import "./styles/Toolbar.css";
import "./styles/Sidebar.css";
import "./styles/Grid.css";
import { PlannerGrid } from "./components/PlannerGrid";
import { ConstraintsSidebar } from "./components/ConstraintsSidebar";
import { MonthSelector } from "./components/MonthSelector";
import { mockSlots as seedSlots, months } from "./data/mock";
import { useMemo, useState } from "react";
import type { GamePlanSlot } from "./types";

function App() {
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [slots, setSlots] = useState(() => {
    const raw = localStorage.getItem("bp.slots");
    return raw ? JSON.parse(raw) : seedSlots;
  });
  const [constraints, setConstraints] = useState(() => {
    const raw = localStorage.getItem("bp.constraints");
    return raw
      ? JSON.parse(raw)
      : [
          { label: "PC", count: 3 },
          { label: "Steam Deck", count: 1 },
          { label: "Co-op", count: 2 },
        ];
  });

  const filteredSlots = useMemo(
    () => slots.filter((s: any) => s.month === selectedMonth),
    [slots, selectedMonth]
  );

  function handleSlotChange(updated: any) {
    setSlots((prev: any[]) => {
      const next = prev.map((s) => (s.id === updated.id ? updated : s));
      localStorage.setItem("bp.slots", JSON.stringify(next));
      return next;
    });
  }

  function handleConstraintChange(label: string, newCount: number) {
    // Update constraint
    const newConstraints = constraints.map((c: any) =>
      c.label === label ? { ...c, count: newCount } : c
    );
    setConstraints(newConstraints);
    localStorage.setItem("bp.constraints", JSON.stringify(newConstraints));

    // Calculate current slot count for this label in the selected month
    const monthSlots = slots.filter(
      (s: GamePlanSlot) => s.month === selectedMonth
    );
    const labelSlots = monthSlots.filter((s: GamePlanSlot) => {
      const normalized = normalizeSlotLabel(s.slotType);
      return normalized === label;
    });

    const currentCount = labelSlots.length;
    const diff = newCount - currentCount;

    if (diff > 0) {
      // Add slots
      const newSlots: GamePlanSlot[] = [];
      for (let i = 0; i < diff; i++) {
        const slotNumber = currentCount + i + 1;
        const id = Math.random().toString(36).slice(2, 11);
        newSlots.push({
          id,
          month: selectedMonth,
          slotType: `${label} ${slotNumber}`,
        });
      }
      const updatedSlots = [...slots, ...newSlots];
      setSlots(updatedSlots);
      localStorage.setItem("bp.slots", JSON.stringify(updatedSlots));
    } else if (diff < 0) {
      // Remove slots (remove empty ones first, then filled ones)
      const toRemove = Math.abs(diff);
      const emptySlots = labelSlots.filter((s: GamePlanSlot) => !s.title);
      const filledSlots = labelSlots.filter((s: GamePlanSlot) => s.title);

      const slotsToRemove = [
        ...emptySlots.slice(0, toRemove),
        ...filledSlots.slice(0, Math.max(0, toRemove - emptySlots.length)),
      ];

      const removeIds = new Set(slotsToRemove.map((s: GamePlanSlot) => s.id));
      const updatedSlots = slots.filter(
        (s: GamePlanSlot) => !removeIds.has(s.id)
      );
      setSlots(updatedSlots);
      localStorage.setItem("bp.slots", JSON.stringify(updatedSlots));
    }
  }

  function normalizeSlotLabel(slotType: string): string {
    if (slotType.startsWith("PC")) return "PC";
    if (slotType.toLowerCase().includes("co-op")) return "Co-op";
    if (slotType.toLowerCase().includes("steam deck")) return "Steam Deck";
    return slotType;
  }

  return (
    <div>
      <header className="hero">
        <h1 className="hero-title">Backlog Planner</h1>
        <p className="hero-subtitle">
          Plan months, set realistic slots, and track progress.
        </p>
      </header>

      <section className="panel">
        <div className="panel-layout">
          <div className="toolbar">
            <MonthSelector
              months={months}
              selected={selectedMonth}
              onChange={setSelectedMonth}
            />
            <div className="spacer" />
          </div>

          <ConstraintsSidebar
            selectedMonth={selectedMonth}
            slots={slots}
            constraints={constraints}
            onUpdateConstraint={handleConstraintChange}
          />

          <div className="panel-main">
            <PlannerGrid
              slots={filteredSlots}
              months={[selectedMonth]}
              onChange={handleSlotChange}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
