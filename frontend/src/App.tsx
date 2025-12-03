import "./styles/App.css";
import "./styles/Sidebar.css";
import "./styles/Grid.css";
import { Navbar } from "./components/Navbar";
import { PlannerGrid } from "./components/PlannerGrid";
import { ConstraintsSidebar } from "./components/ConstraintsSidebar";
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
    const targetLabel = normalizeSlotLabel(label);
    const monthSlots = slots.filter(
      (s: GamePlanSlot) => s.month === selectedMonth
    );
    const labelSlots = monthSlots.filter((s: GamePlanSlot) => {
      const normalized = normalizeSlotLabel(s.slotType);
      return normalized === targetLabel;
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

  function handleRenameConstraint(oldLabel: string, newLabel: string) {
    // Update constraints
    const newConstraints = constraints.map((c: any) =>
      c.label === oldLabel ? { ...c, label: newLabel } : c
    );
    setConstraints(newConstraints);
    localStorage.setItem("bp.constraints", JSON.stringify(newConstraints));

    // Update all slots with this label
    const targetOld = normalizeSlotLabel(oldLabel);
    const updatedSlots = slots.map((s: GamePlanSlot) => {
      const normalized = normalizeSlotLabel(s.slotType);
      if (normalized === targetOld) {
        // Extract the number from the slotType (e.g., "PC 1" -> "1")
        const match = s.slotType.match(/\d+$/);
        const number = match ? ` ${match[0]}` : "";
        return { ...s, slotType: `${newLabel}${number}` };
      }
      return s;
    });
    setSlots(updatedSlots);
    localStorage.setItem("bp.slots", JSON.stringify(updatedSlots));
  }

  function handleDeleteConstraint(label: string) {
    // Remove constraint
    const newConstraints = constraints.filter((c: any) => c.label !== label);
    setConstraints(newConstraints);
    localStorage.setItem("bp.constraints", JSON.stringify(newConstraints));

    // Remove all slots with this label from ALL months
    const targetLabel = normalizeSlotLabel(label);
    const updatedSlots = slots.filter((s: GamePlanSlot) => {
      const normalized = normalizeSlotLabel(s.slotType);
      const keep = normalized !== targetLabel;
      return keep;
    });
    setSlots(updatedSlots);
    localStorage.setItem("bp.slots", JSON.stringify(updatedSlots));
  }

  function handleAddConstraint(label: string) {
    // Check if constraint already exists
    if (constraints.some((c: any) => c.label === label)) {
      alert("A constraint with this name already exists!");
      return;
    }

    // Add new constraint with 0 slots initially
    const newConstraints = [...constraints, { label, count: 0 }];
    setConstraints(newConstraints);
    localStorage.setItem("bp.constraints", JSON.stringify(newConstraints));
  }

  return (
    <div className="app-container">
      <Navbar
        months={months}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <div className="app-layout">
        <aside className="app-sidebar">
          <ConstraintsSidebar
            selectedMonth={selectedMonth}
            slots={slots}
            constraints={constraints}
            onUpdateConstraint={handleConstraintChange}
            onRenameConstraint={handleRenameConstraint}
            onDeleteConstraint={handleDeleteConstraint}
            onAddConstraint={handleAddConstraint}
          />
        </aside>

        <main className="app-main">
          <PlannerGrid
            slots={filteredSlots}
            months={[selectedMonth]}
            onChange={handleSlotChange}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
