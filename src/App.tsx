
import { Canvas } from '@react-three/fiber';
import { ConveyorSystem } from './components/3d/ConveyorSystem';
import { Dashboard } from './components/ui/Dashboard';

function App() {
  return (
    <div className="w-screen h-screen relative bg-[#1a1a1a]">
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
        <ConveyorSystem />
      </Canvas>
      <Dashboard />
    </div>
  );
}

export default App;
