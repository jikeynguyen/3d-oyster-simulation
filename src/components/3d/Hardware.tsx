import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '../../store/simulationStore';
import * as THREE from 'three';

export function CameraMount({ position, label }: { position: [number, number, number], label: string }) {
  return (
    <group position={position}>
      {/* Cột chống */}
      <mesh position={[0, 1.5, -1.8]}>
        <boxGeometry args={[0.2, 3, 0.2]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      <mesh position={[0, 1.5, 1.8]}>
        <boxGeometry args={[0.2, 3, 0.2]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      {/* Thanh ngang */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.5, 0.2, 3.8]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {/* Box Camera (Tỉ lệ thật từ diagram) */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#222" transparent opacity={0.9} />
      </mesh>
      {/* Đèn báo (chớp xanh/đỏ) */}
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 3.6, 0]} center>
        <div className="bg-black/80 text-white font-bold px-2 py-1 rounded text-[10px] whitespace-nowrap border border-gray-600">
          {label}
        </div>
      </Html>
    </group>
  );
}

export function SorterBin({ position, label, color }: { position: [number, number, number], label: string, color: string }) {
  const armRef = useRef<THREE.Mesh>(null);
  const activeSorters = useSimulationStore(state => state.activeSorters);

  useFrame(() => {
    if (!armRef.current) return;
    const triggerTime = activeSorters[position[0]]; 
    
    // Đẩy tay gạt ngang ra (trục Z từ 2.0 lao ra -0.5)
    if (triggerTime && Date.now() - triggerTime < 400) {
      armRef.current.position.z = THREE.MathUtils.lerp(armRef.current.position.z, -0.5, 0.4);
    } else {
      armRef.current.position.z = THREE.MathUtils.lerp(armRef.current.position.z, 2.0, 0.2);
    }
  });

  return (
    <group position={position}>
      {/* Khối xi lanh tay gạt */}
      <mesh position={[0, 0, 2.5]}>
        <boxGeometry args={[0.6, 0.6, 1.0]} />
        <meshStandardMaterial color="#888" metalness={0.6} />
      </mesh>
      
      {/* Cụm Cần gạt nằm ngang */}
      <mesh ref={armRef} position={[0, 0, 2.0]}>
        {/* Xoay cylinder nằm ngang dọc theo trục Z */}
        <cylinderGeometry args={[0.08, 0.08, 2.5]} />
        <meshStandardMaterial color="#ccc" metalness={0.9} />
        {/* Bản lề đẩy */}
        <mesh position={[0, 0, -1.25]}>
          <boxGeometry args={[0.8, 0.4, 0.1]} />
          <meshStandardMaterial color="#ff5500" />
        </mesh>
      </mesh>

      {/* Thùng chứa (rộng 9cm để fit vừa gap 10cm) */}
      <mesh position={[0, -1.0, -2.5]}>
        <boxGeometry args={[0.9, 1.5, 1.5]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <Html position={[0, 0, -2.5]} center>
        <div className="bg-black/80 text-white font-bold px-2 py-1 rounded text-[10px] whitespace-nowrap">
          {label}
        </div>
      </Html>
    </group>
  );
}

export function LoadCell({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Cột cảm biến cân (Load cell sensor) nằm bên hông băng chuyền trạm cân */}
      <mesh position={[0, -0.7, 1.8]}>
        <boxGeometry args={[0.5, 0.8, 0.5]} />
        <meshStandardMaterial color="#888" metalness={0.9} />
      </mesh>
      
      <Html position={[0, -0.7, 2.2]} center>
        <div className="bg-blue-900/90 text-blue-200 font-bold px-2 py-1 rounded text-[10px] whitespace-nowrap border border-blue-500 shadow-lg">
          ⚖️ WEIGHING CONVEYOR
        </div>
      </Html>
    </group>
  );
}
