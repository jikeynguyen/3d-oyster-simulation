import { useEffect } from 'react';
import { useSimulationStore } from '../../store/simulationStore';
import { Play, Pause, Plus, Settings2, Wifi, Camera } from 'lucide-react';

export function Dashboard() {
  const { 
    oysters, spawnOyster, isRunning, toggleSimulation, 
    conveyorSpeed, setConveyorSpeed, latestScan,
    isAutoSpawn, toggleAutoSpawn, autoSpawnRate, setAutoSpawnRate
  } = useSimulationStore();

  // Logic tự động thả hàu
  useEffect(() => {
    if (!isAutoSpawn || !isRunning) return;
    
    // 60000 ms = 1 phút. Khoảng thời gian giữa mỗi con = 60000 / số lượng con
    const intervalTime = 60000 / autoSpawnRate; 
    
    const interval = setInterval(() => {
      spawnOyster();
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isAutoSpawn, isRunning, autoSpawnRate, spawnOyster]);

  const deadCount = oysters.filter(o => o.isDead === true).length;
  const gradeA = oysters.filter(o => o.grade === 'A').length;

  return (
    <div className="absolute top-0 left-0 w-full h-full p-4 pointer-events-none flex justify-between">
      {/* Control Panel (Trái) */}
      <div className="flex flex-col gap-4">
        <div className="bg-black/80 text-white p-4 rounded-lg border border-gray-700 pointer-events-auto w-64 shadow-lg backdrop-blur-sm">
          <h1 className="text-lg font-bold mb-4 text-blue-400">Oyster System Control</h1>
          
          <div className="flex gap-2 mb-4">
            <button 
              onClick={toggleSimulation}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 p-2 rounded transition"
            >
              {isRunning ? <Pause size={16}/> : <Play size={16}/>}
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            
            <button 
              onClick={spawnOyster}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 p-2 rounded transition shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            >
              <Plus size={16}/> Spawn
            </button>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Settings2 size={16}/> Conveyor Speed ({conveyorSpeed.toFixed(1)}x)
            </label>
            <input 
              type="range" min="0.5" max="5" step="0.5" 
              value={conveyorSpeed} 
              onChange={(e) => setConveyorSpeed(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="mb-4 border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <Settings2 size={16}/> Auto Spawn
              </label>
              <button 
                onClick={toggleAutoSpawn}
                className={`px-2 py-0.5 text-xs rounded font-bold transition ${isAutoSpawn ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
              >
                {isAutoSpawn ? 'ON' : 'OFF'}
              </button>
            </div>
            {isAutoSpawn && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>5/min</span>
                  <span className="text-green-400 font-bold">{autoSpawnRate}/min</span>
                  <span>60/min</span>
                </div>
                <input 
                  type="range" min="5" max="60" step="1" 
                  value={autoSpawnRate} 
                  onChange={(e) => setAutoSpawnRate(parseInt(e.target.value))}
                  className="w-full accent-green-500"
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <h2 className="text-sm font-bold text-gray-400 mb-2">Live Production Stats</h2>
            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
              <div className="bg-gray-800 p-2 rounded border border-gray-700">Total: {oysters.length}</div>
              <div className="bg-red-900/30 p-2 rounded text-red-400 border border-red-900/50">Dead: {deadCount}</div>
              <div className="bg-green-900/30 p-2 rounded text-green-400 border border-green-900/50">Grade A: {gradeA}</div>
            </div>
          </div>
        </div>

        {/* Network Protocols Panel */}
        <div className="bg-black/80 text-white p-3 rounded-lg border border-gray-700 pointer-events-auto w-64 shadow-lg backdrop-blur-sm">
          <h2 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
            <Wifi size={14}/> Network Interfaces
          </h2>
          <div className="space-y-2 text-[11px] font-mono">
            <div className="flex justify-between items-center bg-gray-900 p-1.5 rounded">
              <span className="text-gray-400">MQTT Broker</span>
              <span className="text-green-400 flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> CONNECTED</span>
            </div>
            <div className="flex justify-between items-center bg-gray-900 p-1.5 rounded">
              <span className="text-gray-400">Topic</span>
              <span className="text-blue-300">oyster/line1/#</span>
            </div>
            <div className="flex justify-between items-center bg-gray-900 p-1.5 rounded">
              <span className="text-gray-400">Edge PC API</span>
              <span className="text-green-400">HTTP 200 OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột Bên Phải: Camera Feed & Logs */}
      <div className="flex flex-col gap-4 items-end">
        
        {/* Camera AI Vision Feed */}
        <div className="bg-black/90 text-white p-0 rounded-lg border border-gray-700 pointer-events-auto w-80 shadow-2xl backdrop-blur-md overflow-hidden">
          <div className="bg-gray-800 p-2 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-xs font-bold text-gray-300 flex items-center gap-2">
              <Camera size={14}/> EDGE PC VISION - CAM 2
            </h2>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] text-red-400 font-mono">REC</span>
            </div>
          </div>
          
          <div className="relative w-full h-48 bg-[#111] flex items-center justify-center p-2">
            {latestScan ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center border border-dashed border-green-500/30 rounded overflow-hidden">
                {/* Ảnh kết quả phân tích hiển thị động theo Grade */}
                <img 
                  src={
                    latestScan.grade === 'DEAD' ? `${import.meta.env.BASE_URL}D1.png` :
                    latestScan.grade === 'A' ? `${import.meta.env.BASE_URL}A.png` :
                    latestScan.grade === 'B' ? `${import.meta.env.BASE_URL}B.png` :
                    latestScan.grade === 'C' ? `${import.meta.env.BASE_URL}C.png` :
                    latestScan.grade === 'D' ? `${import.meta.env.BASE_URL}D.png` :
                    `${import.meta.env.BASE_URL}Screenshot 2026-06-17 at 13.47.02.png`
                  } 
                  alt="Scanned Oyster" 
                  className="absolute inset-0 w-full h-full object-contain opacity-90 mix-blend-screen" 
                />
                
                {/* Giả lập khung bounding box AI (Chỉ hiện khi hàu sống) */}
                {latestScan.grade !== 'DEAD' && (
                  <>
                    <div className="absolute inset-4 border-2 border-green-500 rounded-full opacity-80 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                    <div className="absolute inset-x-12 top-1/2 h-0.5 bg-red-500/80 -translate-y-1/2 rotate-[15deg]"></div>
                    <div className="absolute inset-y-8 left-1/2 w-0.5 bg-red-500/80 -translate-x-1/2 -rotate-[15deg]"></div>
                  </>
                )}
                
                {/* Thông số Overlay */}
                <div className="absolute top-2 left-2 z-10 font-mono drop-shadow-lg bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                  <div className={`text-sm font-bold ${
                    latestScan.grade === 'A' ? 'text-green-400' : 
                    latestScan.grade === 'B' ? 'text-blue-400' : 
                    latestScan.grade === 'DEAD' ? 'text-red-500' : 'text-yellow-400'
                  }`}>
                    {latestScan.grade === 'DEAD' ? 'STATUS: DEAD' : `PCI Grade ${latestScan.grade}`}
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 z-10 font-mono drop-shadow-lg bg-black/60 px-2 py-1 rounded text-right backdrop-blur-sm">
                  <div className="text-xs text-gray-300">ID: {latestScan.id}</div>
                  {latestScan.grade !== 'DEAD' && (
                    <div className="text-xs text-green-300 mt-0.5">
                      Fat: {latestScan.fat} | SH/SL: {latestScan.sh_sl}
                    </div>
                  )}
                  <div className="text-[10px] text-gray-400 mt-0.5">W: {latestScan.weight}g</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600 font-mono text-sm animate-pulse">Waiting for object...</div>
            )}
          </div>
        </div>

        {/* Log Console */}
        <div className="bg-black/80 text-green-400 font-mono text-xs p-4 rounded-lg border border-gray-700 pointer-events-auto w-80 h-64 overflow-y-auto flex flex-col-reverse shadow-lg backdrop-blur-sm">
          <div>
            <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1 sticky top-0 bg-black/90">// MQTT & HTTP Logs</div>
            {oysters.map(o => (
               <div key={o.id} className="mb-1 border-b border-gray-800/50 pb-1 hover:bg-gray-900/50 p-1 rounded">
                 <div><span className="text-blue-400">[{o.id}]</span> ENC: {o.positionX.toFixed(1)}cm</div>
                 {o.isDead !== null && (
                    <div className={o.isDead ? 'text-red-400' : 'text-gray-400'}>
                      → {o.isDead ? 'DEAD (Trigger Sorter 1)' : 'ALIVE'}
                    </div>
                 )}
                 {o.grade && <div className="text-green-300">→ PCI Grade: {o.grade} (PUB: mqtt://action)</div>}
               </div>
            )).reverse()}
          </div>
        </div>

      </div>
    </div>
  );
}
