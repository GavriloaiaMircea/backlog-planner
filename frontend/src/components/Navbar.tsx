import { MonthSelector } from "./MonthSelector";

type NavbarProps = {
  months: string[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
};

export function Navbar({ months, selectedMonth, onMonthChange }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1 className="navbar-title">Backlog Planner</h1>
        <p className="navbar-subtitle">
          Plan months, set realistic slots, and track progress.
        </p>
      </div>
      <div className="navbar-controls">
        <MonthSelector
          months={months}
          selected={selectedMonth}
          onChange={onMonthChange}
        />
      </div>
    </nav>
  );
}
