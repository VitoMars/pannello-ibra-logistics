import { create } from 'zustand';
import { MovementHistory } from "../types/types";

interface WarehouseState {
  selectedWarehouseId: string | null;
  setSelectedWarehouseId: (id: string | null) => void;
  movementHistory: MovementHistory[];
  setMovementHistory: (history: MovementHistory[]) => void;
}

export const useWarehouseStore = create<WarehouseState>((set) => ({
  selectedWarehouseId: null,
  setSelectedWarehouseId: (id) => set({ selectedWarehouseId: id }),
  movementHistory: [],
  setMovementHistory: (history) => set({ movementHistory: history }),
}));
