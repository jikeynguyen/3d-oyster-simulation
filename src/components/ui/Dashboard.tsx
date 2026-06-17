import { useEffect } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Play, Pause, Plus, Settings2 } from 'lucide-react';
import type { OysterGrade } from '../../types/simulation';

export function Dashboard() {
  const { 
    oysters, spawnOyster, isRunning, toggleSimulation, 
    conveyorSpeed, setConveyorSpeed,
    markOysterStatus, markOysterGrade
  } = useSimulationStore();

  // Dashboard component không cần xử lý AI loop nữa, vì OysterItem sẽ tự handle
  // (để tránh lag do không cần đồng bộ toạ độ X liên tục lên Zustand)

  const deadCount = oysters.filter(o => o.isDead === true).length;
  const gradeA = oysters.filter(o => o.grade === 'A').length;

  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between">
      {/* Control Panel */}
      <div className="bg-black/80 text-white p-4 rounded-lg border border-gray-700 pointer-events-auto w-64">
        <h1 className="text-lg font-bold mb-4 text-blue-400">Oyster Sorting System</h1>
        
        <div className="flex gap-2 mb-4">
          <button 
            onClick={toggleSimulation}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 p-2 rounded"
          >
            {isRunning ? <Pause size={16}/> : <Play size={16}/>}
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          
          <button 
            onClick={spawnOyster}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 p-2 rounded"
          >
            <Plus size={16}/> Spawn
          </button>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Settings2 size={16}/> Speed ({conveyorSpeed.toFixed(1)}x)
          </label>
          <input 
            type="range" min="0.5" max="5" step="0.5" 
            value={conveyorSpeed} 
            onChange={(e) => setConveyorSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <h2 className="text-sm font-bold text-gray-400 mb-2">Live Stats</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-800 p-2 rounded">Total: {oysters.length}</div>
            <div className="bg-red-900/50 p-2 rounded text-red-400">Dead: {deadCount}</div>
            <div className="bg-green-900/50 p-2 rounded text-green-400">Grade A: {gradeA}</div>
          </div>
        </div>
      </div>

      {/* Log Console */}
      <div className="bg-black/80 text-green-400 font-mono text-xs p-4 rounded-lg border border-gray-700 pointer-events-auto w-80 h-64 overflow-y-auto">
        <div className="text-gray-500 mb-2">// Edge PC AI Logs</div>
        {oysters.map(o => (
           <div key={o.id} className="mb-1 border-b border-gray-800 pb-1">
             <div><span className="text-blue-400">[{o.id}]</span> Pos: X={o.positionX.toFixed(2)}</div>
             {o.isDead !== null && (
                <div className={o.isDead ? 'text-red-400' : 'text-gray-400'}>
                  Live/Dead: {o.isDead ? 'DEAD' : 'ALIVE'}
                </div>
             )}
             {o.grade && <div className="text-green-300">Grade: {o.grade}</div>}
           </div>
        ))}
      </div>
    </div>
  );
}
