import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '../../store/simulationStore';

interface ConveyorBeltProps {
  position: [number, number, number];
  length: number;
  width?: number;
  color?: string;
}

export function ConveyorBelt({ position, length, width = 1, color = '#333333' }: ConveyorBeltProps) {
  const { isRunning, conveyorSpeed } = useSimulationStore();

  // Tạo texture sọc (vân băng tải) bằng Canvas API
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Màu nền của băng chuyền
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 128, 128);
      
      // Vẽ các đường gờ nổi (sọc dọc)
      ctx.fillStyle = '#1a1a1a';
      for (let i = 0; i < 128; i += 16) {
        ctx.fillRect(i, 0, 8, 128);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(length * 2, 1); // Tăng mật độ sọc dựa theo chiều dài băng
    return tex;
  }, [length, color]);

  // Animation di chuyển texture để tạo cảm giác băng đang chạy
  useFrame((_state, delta) => {
    if (isRunning && texture) {
      // Trừ đi offset X sẽ làm texture chạy về phía dương X
      texture.offset.x -= (conveyorSpeed * delta) * 0.5; 
    }
  });

  return (
    <group position={position}>
      {/* Trục Lăn Đầu Tiên */}
      <mesh position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, width + 0.05, 16]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>

      {/* Dây Băng Chuyền (Mặt trên) */}
      <mesh position={[length / 2, -0.25, 0]} receiveShadow>
        <boxGeometry args={[length, 0.5, width]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>

      {/* Chân đế (tượng trưng) */}
      <mesh position={[0.5, -0.75, 0]}>
        <boxGeometry args={[0.2, 1, width - 0.2]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[length - 0.5, -0.75, 0]}>
        <boxGeometry args={[0.2, 1, width - 0.2]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Trục Lăn Cuối Cùng */}
      <mesh position={[length, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.26, 0.26, width + 0.05, 16]} />
        <meshStandardMaterial color="#888" metalness={0.8} />
      </mesh>
    </group>
  );
}
