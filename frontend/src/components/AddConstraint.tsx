import { useState } from "react";

type AddConstraintProps = {
  onAdd: (name: string) => void;
};

export function AddConstraint({ onAdd }: AddConstraintProps) {
  const [name, setName] = useState("");

  function handleAdd() {
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
    }
  }

  return (
    <div className="constraint-add">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="New constraint name..."
        className="constraint-add-input"
      />
      <button
        onClick={handleAdd}
        className="constraint-add-btn"
        disabled={!name.trim()}
      >
        + Add Constraint
      </button>
    </div>
  );
}
