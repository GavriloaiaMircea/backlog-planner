type Props = {
  months: string[];
  selected: string;
  onChange: (month: string) => void;
};

export function MonthSelector({ months, selected, onChange }: Props) {
  return (
    <div className="month-selector">
      <label className="month-label">Month</label>
      <select
        className="grid-select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {formatMonth(m)}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatMonth(m: string) {
  const [y, mm] = m.split("-");
  const d = new Date(Number(y), Number(mm) - 1, 1);
  const name = d.toLocaleString("en-US", { month: "long" });
  return `${name} ${y}`;
}
