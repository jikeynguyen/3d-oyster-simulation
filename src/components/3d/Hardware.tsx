import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '../../store/simulationStore';
import * as THREE from 'three';

export function CameraMount({ position, label }: { position: [number, number, number], label: string }) {
  return (
    <group position={position}>
      {/* Cột dọc */}
      <mesh position={[0, 1, -0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>
      {/* Thanh ngang */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.2, 0.1, 1]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>
      {/* Camera */}
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.3]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Ống kính */}
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#44f" emissive="#00a" emissiveIntensity={0.5} />
      </mesh>
      <Html position={[0, 2.2, 0]} center>
        <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
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
    const triggerTime = activeSorters[position[0]]; // Dùng tọa độ X làm ID của Sorter
    
    // Nếu vừa được kích hoạt trong vòng 400ms -> Đẩy ra
    if (triggerTime && Date.now() - triggerTime < 400) {
      armRef.current.position.z = THREE.MathUtils.lerp(armRef.current.position.z, 0.0, 0.3);
    } else {
      // Thu về vị trí cũ
      armRef.current.position.z = THREE.MathUtils.lerp(armRef.current.position.z, 0.6, 0.1);
    }
  });

  return (
    <group position={position}>
      {/* Khối xi lanh tay gạt (nằm đối diện thùng) */}
      <mesh position={[0, 0, 1]}>
        <boxGeometry args={[0.3, 0.4, 0.6]} />
        <meshStandardMaterial color="#888" metalness={0.6} />
      </mesh>
      
      {/* Cụm Cần gạt có thể chuyển động */}
      <mesh ref={armRef} position={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8]} />
        <meshStandardMaterial color="#ccc" metalness={0.9} />
        {/* Bản lề đẩy gắn liền với cần gạt */}
        <mesh position={[0, 0, -0.4]}>
          <boxGeometry args={[0.4, 0.2, 0.05]} />
          <meshStandardMaterial color="#ff5500" />
        </mesh>
      </mesh>

      {/* Thùng chứa */}
      <mesh position={[0, -0.5, -1]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <Html position={[0, 0, -1]} center>
        <div className="bg-black/80 text-white font-bold px-2 py-1 rounded text-sm whitespace-nowrap">
          {label}
        </div>
      </Html>
    </group>
  );
}

export function Sensor({ position, isTriggered }: { position: [number, number, number], isTriggered: boolean }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.1, 0.2, 0.1]} />
      <meshStandardMaterial 
        color={isTriggered ? '#ff0000' : '#00ff00'} 
        emissive={isTriggered ? '#ff0000' : '#00ff00'} 
        emissiveIntensity={0.8} 
      />
    </mesh>
  );
}
