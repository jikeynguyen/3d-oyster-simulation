export type OysterGrade = 'A' | 'B' | 'C' | 'D' | null;

export interface Oyster {
  id: string;
  weight: number;
  positionX: number; // Current position on the conveyor
  isDead: boolean | null; // null means not yet checked
  grade: OysterGrade;
  beltIndex: number; // 0 for belt 1, 1 for belt 2
}

export interface SimulationState {
  oysters: Oyster[];
  spawnOyster: () => void;
  updateOysterPosition: (id: string, newX: number) => void;
  updateOysterBelt: (id: string, newBelt: number) => void;
  markOysterStatus: (id: string, isDead: boolean) => void;
  markOysterGrade: (id: string, grade: OysterGrade) => void;
  removeOyster: (id: string) => void;
  conveyorSpeed: number;
  setConveyorSpeed: (speed: number) => void;
  isRunning: boolean;
  toggleSimulation: () => void;
  activeSorters: Record<number, number>;
  triggerSorter: (x: number) => void;
  latestScan: { id: string; grade: string; weight: number; fat: number; sh_sl: number } | null;
  setLatestScan: (scan: { id: string; grade: string; weight: number; fat: number; sh_sl: number } | null) => void;

  isAutoSpawn: boolean;
  toggleAutoSpawn: () => void;
  autoSpawnRate: number;
  setAutoSpawnRate: (rate: number) => void;
}
