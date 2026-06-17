import { create } from 'zustand';
import type { SimulationState, OysterGrade } from '../types/simulation';

export const useSimulationStore = create<SimulationState>((set) => ({
  oysters: [],
  spawnOyster: () => set((state) => {
    const newOyster = {
      id: `L1-${Date.now().toString().slice(-4)}`,
      weight: Math.floor(Math.random() * (160 - 100 + 1)) + 100, // Random weight 100-160g
      positionX: 0,
      isDead: null,
      grade: null,
      beltIndex: 0,
    };
    return { oysters: [...state.oysters, newOyster] };
  }),
  updateOysterPosition: (id, newX) => set((state) => ({
    oysters: state.oysters.map((o) => o.id === id ? { ...o, positionX: newX } : o)
  })),
  updateOysterBelt: (id, newBelt) => set((state) => ({
    oysters: state.oysters.map((o) => o.id === id ? { ...o, beltIndex: newBelt, positionX: 0 } : o) // reset X when changing belt
  })),
  markOysterStatus: (id, isDead) => set((state) => ({
    oysters: state.oysters.map((o) => o.id === id ? { ...o, isDead } : o)
  })),
  markOysterGrade: (id, grade) => set((state) => ({
    oysters: state.oysters.map((o) => o.id === id ? { ...o, grade } : o)
  })),
  removeOyster: (id) => set((state) => ({
    oysters: state.oysters.filter((o) => o.id !== id)
  })),
  conveyorSpeed: 2.0, // units per second
  setConveyorSpeed: (speed) => set({ conveyorSpeed: speed }),
  isRunning: true,
  toggleSimulation: () => set((state) => ({ isRunning: !state.isRunning })),
  activeSorters: {},
  triggerSorter: (x) => set((state) => ({ activeSorters: { ...state.activeSorters, [x]: Date.now() } })),
}));
