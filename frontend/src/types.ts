export type Platform = "PC" | "Steam Deck" | "Console" | "Multiplayer";

export type Status = "Backlog" | "Playing" | "Completed" | "Dropped";

export interface GamePlanSlot {
  id: string;
  month: string; // YYYY-MM
  slotType: string; // e.g., "PC 1", "Steam Deck"
  title?: string;
  platform?: Platform;
  status?: Status;
  rating?: number | null; // 1-10
  note?: string;
}

export interface MonthConstraintPreset {
  id: string;
  name: string;
  constraints: Array<{ label: string; count: number }>;
}
