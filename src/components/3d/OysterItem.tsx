import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Oyster, OysterGrade } from '../../types/simulation';
import { useSimulationStore } from '../../store/simulationStore';
import * as THREE from 'three';

export function OysterItem({ data }: { data: Oyster }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { conveyorSpeed, isRunning, updateOysterBelt, removeOyster, markOysterStatus, markOysterGrade } = useSimulationStore();
  const [localX, setLocalX] = useState(data.positionX);
  const [isSorted, setIsSorted] = useState(false);

  useFrame((state, delta) => {
    if (!isRunning || !meshRef.current) return;

    let currentX = localX;

    // Nếu chưa bị gạt, thì tiếp tục đi thẳng theo trục X
    if (!isSorted) {
      currentX = localX + conveyorSpeed * delta;
      setLocalX(currentX);
      meshRef.current.position.x = currentX;
    } else {
      // Nếu đã bị gạt, chỉ rơi xuống theo trục Z (không đi tới nữa)
      meshRef.current.position.z -= conveyorSpeed * delta * 4;
      if (meshRef.current.position.z < -1.5) {
        removeOyster(data.id);
      }
      return; 
    }

    // Logic Băng tải 1
    if (data.beltIndex === 0) {
      if (currentX > 3.0) { // Cuối băng 1
        updateOysterBelt(data.id, 1); // Chuyển sang băng 2, X reset về 0
      }
    } 
    // Logic Băng tải 2
    else if (data.beltIndex === 1) {
      // Camera 1: Sống/Chết ở vị trí x = 1.0
      if (currentX > 1.0 && data.isDead === null) {
        const isDead = Math.random() > 0.7; // 30% tỉ lệ chết cho dễ test
        markOysterStatus(data.id, isDead);
      }

      // Camera 2: Grading ở vị trí x = 3.0
      if (currentX > 3.0 && data.isDead === false && data.grade === null) {
        const grades: OysterGrade[] = ['A', 'B', 'C', 'D'];
        const randomGrade = grades[Math.floor(Math.random() * grades.length)];
        markOysterGrade(data.id, randomGrade);
      }

      // Kiểm tra xem đã đến lúc bị gạt chưa
      let shouldSort = false;
      let targetX = 0;

      if (data.isDead === true && currentX >= 2.0) {
        shouldSort = true;
        targetX = 2.0;
      } else if (data.isDead === false && data.grade) {
        const targetForGrade = data.grade === 'A' ? 4.0 : data.grade === 'B' ? 5.0 : data.grade === 'C' ? 6.0 : 7.0;
        if (currentX >= targetForGrade) {
          shouldSort = true;
          targetX = targetForGrade;
        }
      }

      if (shouldSort) {
        useSimulationStore.getState().triggerSorter(targetX);
        setIsSorted(true);
      }

      // Rơi khỏi băng chuyền nếu chưa được phân loại (Cuối băng 2)
      if (currentX > 8.0) {
        removeOyster(data.id);
      }
    }
  });

  // Chọn màu sắc
  let color = '#ffaa00'; // Mặc định
  if (data.isDead === true) color = '#ff3333';
  if (data.grade === 'A') color = '#33ff33';
  if (data.grade === 'B') color = '#33ccff';
  
  return (
    <mesh ref={meshRef} position={[localX, 0.1, 0]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.7} />
      <Html position={[0, 0.3, 0]} center>
        <div className="bg-white/80 text-black px-1 rounded text-[10px] whitespace-nowrap shadow border">
          {data.id} <br/> {data.weight}g <br/> 
          {data.isDead === true ? 'DEAD' : data.grade ? `Grade: ${data.grade}` : ''}
        </div>
      </Html>
    </mesh>
  );
}
