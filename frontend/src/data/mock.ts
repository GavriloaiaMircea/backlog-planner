import type { GamePlanSlot } from "../types";

// Seed a few months with slots similar to the spreadsheet example
export const mockSlots: GamePlanSlot[] = [
  {
    id: "1",
    month: "2025-01",
    slotType: "PC 1",
    title: "Dying Light",
    platform: "PC",
    status: "Playing",
    rating: null,
    note: "",
  },
  {
    id: "2",
    month: "2025-01",
    slotType: "PC 2",
    title: "Expedition 33",
    platform: "PC",
    status: "Backlog",
    rating: null,
    note: "",
  },
  {
    id: "3",
    month: "2025-01",
    slotType: "PC 3",
    title: "Bulletstorm",
    platform: "PC",
    status: "Backlog",
    rating: null,
    note: "",
  },
  {
    id: "4",
    month: "2025-01",
    slotType: "Steam Deck",
    title: "Batman Arkham City",
    platform: "Steam Deck",
    status: "Backlog",
    rating: null,
    note: "",
  },
  {
    id: "5",
    month: "2025-01",
    slotType: "Co-op 1",
    title: "Helldivers 2",
    platform: "Multiplayer",
    status: "Playing",
    rating: null,
    note: "",
  },
  {
    id: "6",
    month: "2025-01",
    slotType: "Co-op 2",
    title: "DBD",
    platform: "Multiplayer",
    status: "Backlog",
    rating: null,
    note: "",
  },

  // February
  { id: "7", month: "2025-02", slotType: "PC 1" },
  { id: "8", month: "2025-02", slotType: "PC 2" },
  { id: "9", month: "2025-02", slotType: "PC 3" },
  { id: "10", month: "2025-02", slotType: "Steam Deck" },
  { id: "11", month: "2025-02", slotType: "Co-op 1" },
  { id: "12", month: "2025-02", slotType: "Co-op 2" },

  // March
  { id: "13", month: "2025-03", slotType: "PC 1" },
  { id: "14", month: "2025-03", slotType: "PC 2" },
  { id: "15", month: "2025-03", slotType: "PC 3" },
  { id: "16", month: "2025-03", slotType: "Steam Deck" },
  { id: "17", month: "2025-03", slotType: "Co-op 1" },
  { id: "18", month: "2025-03", slotType: "Co-op 2" },

  // April
  { id: "19", month: "2025-04", slotType: "PC 1" },
  { id: "20", month: "2025-04", slotType: "PC 2" },
  { id: "21", month: "2025-04", slotType: "PC 3" },
  { id: "22", month: "2025-04", slotType: "Steam Deck" },
  { id: "23", month: "2025-04", slotType: "Co-op 1" },
  { id: "24", month: "2025-04", slotType: "Co-op 2" },

  // May
  { id: "25", month: "2025-05", slotType: "PC 1" },
  { id: "26", month: "2025-05", slotType: "PC 2" },
  { id: "27", month: "2025-05", slotType: "PC 3" },
  { id: "28", month: "2025-05", slotType: "Steam Deck" },
  { id: "29", month: "2025-05", slotType: "Co-op 1" },
  { id: "30", month: "2025-05", slotType: "Co-op 2" },
];

export const months = [
  "2025-01",
  "2025-02",
  "2025-03",
  "2025-04",
  "2025-05",
  "2025-06",
  "2025-07",
  "2025-08",
  "2025-09",
  "2025-10",
  "2025-11",
  "2025-12",
];

export const statusOptions = [
  "Backlog",
  "Playing",
  "Completed",
  "Dropped",
] as const;
