import { ConveyorBelt } from './ConveyorBelt';
import { CameraMount, SorterBin } from './Hardware';
import { OysterItem } from './OysterItem';
import { useSimulationStore } from '../../store/simulationStore';
import { OrbitControls, Environment } from '@react-three/drei';

export function ConveyorSystem() {
  const oysters = useSimulationStore((state) => state.oysters);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="warehouse" />
      <OrbitControls makeDefault />

      {/* Băng tải 1: Cân */}
      <group position={[-4, 0, 0]}>
        <ConveyorBelt position={[0, 0, 0]} length={3} width={1} />
        <Html position={[1.5, 0.5, 0.5]} center><div className="text-white bg-blue-600 px-2 py-1 rounded text-sm">Trạm Cân</div></Html>
        {oysters.filter(o => o.beltIndex === 0).map(oyster => (
          <OysterItem key={oyster.id} data={oyster} />
        ))}
      </group>

      {/* Băng tải 2: Phân loại */}
      <group position={[0, 0, 0]}>
        <ConveyorBelt position={[0, 0, 0]} length={8} width={1} />
        
        <CameraMount position={[1.0, 0, 0]} label="Camera 1: Sống/Chết" />
        <SorterBin position={[2.0, 0, -1]} label="Thùng Chết" color="#aa3333" />
        
        <CameraMount position={[3.0, 0, 0]} label="Camera 2: Grading" />
        <SorterBin position={[4.0, 0, -1]} label="Grade A" color="#33aa33" />
        <SorterBin position={[5.0, 0, -1]} label="Grade B" color="#33aaff" />
        <SorterBin position={[6.0, 0, -1]} label="Grade C" color="#aaaa33" />
        <SorterBin position={[7.0, 0, -1]} label="Grade D" color="#888888" />

        {oysters.filter(o => o.beltIndex === 1).map(oyster => (
          <OysterItem key={oyster.id} data={oyster} />
        ))}
      </group>
    </>
  );
}

// Giả lập thư viện Html để render text 2D trong 3D
import { Html } from '@react-three/drei';
