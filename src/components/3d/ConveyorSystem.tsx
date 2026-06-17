import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { ConveyorBelt } from './ConveyorBelt';
import { CameraMount, SorterBin, LoadCell } from './Hardware';
import { OysterItem } from './OysterItem';
import { useSimulationStore } from '../../store/simulationStore';

export function ConveyorSystem() {
  const oysters = useSimulationStore(state => state.oysters);

  return (
    <group>
      <PerspectiveCamera makeDefault position={[10, 10, 15]} fov={50} />
        <OrbitControls target={[10, 0, 0]} />
        <Environment preset="warehouse" />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} castShadow intensity={1} shadow-mapSize={[2048, 2048]} />

        {/* Hệ thống băng chuyền được chia làm các đoạn độc lập */}
        {/* Băng 1: Trạm Cân ở ngay đầu vào (Weighing Conveyor) */}
        <ConveyorBelt position={[0, 0, 0]} length={1.5} width={3} color="#2d5986" />
        
        {/* Băng 2: Băng chuyền chính xử lý Camera và Phân loại */}
        <ConveyorBelt position={[1.5, 0, 0]} length={19} width={3} />

        {/* Thiết bị phần cứng theo đúng tỷ lệ Diagram (1 unit = 10cm) */}
        
        {/* Trạm Cân Load Cell ngay trên băng 1 (X=0.75) */}
        <LoadCell position={[0.75, 0, 0]} />

        {/* Gap 10cm -> Camera 1 (X=2) */}
        <CameraMount position={[2, 0, 0]} label="Cam 1 (Live/Dead)" />
        
        {/* Gap 20cm -> Dead Sorter (X=5) */}
        <SorterBin position={[5, 0, 0]} label="Dead" color="#ff3333" />
        
        {/* Gap 10cm -> Camera 2 (X=8) */}
        <CameraMount position={[8, 0, 0]} label="Cam 2 (Grading & Fat)" />
        
        {/* Gap 60cm -> Grade A (X=14) */}
        <SorterBin position={[14, 0, 0]} label="Grade A" color="#33ff33" />
        {/* Gap 10cm -> Grade B (X=15) */}
        <SorterBin position={[15, 0, 0]} label="Grade B" color="#33ccff" />
        {/* Gap 10cm -> Grade C (X=16) */}
        <SorterBin position={[16, 0, 0]} label="Grade C" color="#ffaa00" />
        {/* Gap 10cm -> Grade D (X=17) */}
        <SorterBin position={[17, 0, 0]} label="Grade D" color="#cc33ff" />

        {/* Thùng chứa Unsorted ở cuối băng chuyền (X=20.5) */}
        <mesh position={[20.5, -1.5, 0]}>
          <boxGeometry args={[2, 1.5, 3]} />
          <meshStandardMaterial color="#666" transparent opacity={0.8} />
        </mesh>

        {oysters.map(oyster => (
          <OysterItem key={oyster.id} data={oyster} />
        ))}
      </group>
  );
}
