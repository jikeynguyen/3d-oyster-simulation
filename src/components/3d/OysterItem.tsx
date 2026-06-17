import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Oyster, OysterGrade } from '../../types/simulation';
import { useSimulationStore } from '../../store/simulationStore';
import * as THREE from 'three';

export function OysterItem({ data }: { data: Oyster }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { conveyorSpeed, isRunning, removeOyster, markOysterStatus, markOysterGrade } = useSimulationStore();
  const [localX, setLocalX] = useState(data.positionX);
  const [isSorted, setIsSorted] = useState(false);
  const [isDropped, setIsDropped] = useState(false);

  // Load texture không dùng Suspense (chỉ dùng ảnh gốc cho hàu trên băng chuyền)
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const t = loader.load(`${import.meta.env.BASE_URL}conhaungon.png`);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useFrame((_state, delta) => {
    if (!isRunning || !meshRef.current) return;

    let currentX = localX;

    // Nếu chưa bị gạt, thì tiếp tục đi thẳng theo trục X
    if (!isSorted) {
      currentX = localX + conveyorSpeed * delta;
      setLocalX(currentX);
      meshRef.current.position.x = currentX;
    } else {
      // Bị gạt thì văng ngang theo trục Z âm
      meshRef.current.position.z -= conveyorSpeed * delta * 5;
      if (meshRef.current.position.z < -3.0) {
        removeOyster(data.id);
      }
      return;
    }

    // Camera 1: Sống/Chết ở vị trí x = 2.0
    if (currentX > 2.0 && data.isDead === null) {
      const isDead = Math.random() > 0.7; // 30% tỉ lệ chết
      markOysterStatus(data.id, isDead);
      
      const shortId = data.id.substring(0, 5);
      if (isDead) {
        useSimulationStore.getState().addLog(`[CAM 1] Oyster #${shortId} LIVE/DEAD ANALYSIS: Detected as DEAD. Activating pneumatic ejector to Dead Bin.`, 'cam1');
        // Update màn hình PC khi phát hiện hàu chết
        useSimulationStore.getState().setLatestScan({
          id: data.id,
          grade: 'DEAD',
          weight: data.weight,
          fat: 0,
          sh_sl: 0
        });
      } else {
        useSimulationStore.getState().addLog(`[CAM 1] Oyster #${shortId} LIVE/DEAD ANALYSIS: Status is ALIVE. Proceeding to grading.`, 'cam1');
      }
    }

    // Camera 2: Grading ở vị trí x = 8.0
    if (currentX > 8.0 && data.isDead === false && data.grade === null) {
      const grades: OysterGrade[] = ['A', 'B', 'C', 'D'];
      const randomGrade = grades[Math.floor(Math.random() * grades.length)];
      markOysterGrade(data.id, randomGrade);

      const fat = parseFloat((Math.random() * (0.9 - 0.4) + 0.4).toFixed(2));
      const sh_sl = parseFloat((Math.random() * (1.6 - 1.1) + 1.1).toFixed(2));

      const shortId = data.id.substring(0, 5);
      useSimulationStore.getState().addLog(`[CAM 2] Oyster #${shortId} QUALITY ANALYSIS: Weight: ${data.weight}g, Fat Index: ${fat}, SH/SL Ratio: ${sh_sl}. Grade assigned: ${randomGrade}. Target sorter armed.`, 'cam2');

      // Cập nhật ảnh Camera Feed trên Dashboard
      useSimulationStore.getState().setLatestScan({
        id: data.id,
        grade: randomGrade as string,
        weight: data.weight,
        fat: fat,
        sh_sl: sh_sl
      });
    }

    // Kiểm tra xem đã đến lúc bị gạt chưa
    let shouldSort = false;
    let targetX = 0;

    if (data.isDead === true && currentX >= 5.0) {
      shouldSort = true;
      targetX = 5.0;
    } else if (data.isDead === false && data.grade) {
      const targetForGrade = data.grade === 'A' ? 14.0 : data.grade === 'B' ? 15.0 : data.grade === 'C' ? 16.0 : 17.0;
      if (currentX >= targetForGrade) {
        shouldSort = true;
        targetX = targetForGrade;
      }
    }

    if (shouldSort) {
      useSimulationStore.getState().triggerSorter(targetX);
      setIsSorted(true);
      
      const shortId = data.id.substring(0, 5);
      if (data.isDead) {
        useSimulationStore.getState().addLog(`[SORTER] Oyster #${shortId} ejected into Dead bin.`, 'sort');
        useSimulationStore.getState().incrementStat('dead');
      } else if (data.grade) {
        useSimulationStore.getState().addLog(`[SORTER] Oyster #${shortId} ejected into Grade ${data.grade} bin.`, 'sort');
        useSimulationStore.getState().incrementStat(data.grade as 'A'|'B'|'C'|'D');
      }
    }

    // Rơi khỏi băng chuyền nếu chưa được phân loại (Cuối băng 2 ở X=20)
    if (currentX > 20.0) {
      if (!isDropped) {
        const shortId = data.id.substring(0, 5);
        useSimulationStore.getState().addLog(`[END LINE] Oyster #${shortId} reached end of belt. Dropped into UNSORTED bin.`, 'info');
        useSimulationStore.getState().incrementStat('unsorted');
        setIsDropped(true);
      }
      meshRef.current.position.y -= conveyorSpeed * delta * 2;
      if (meshRef.current.position.y < -2.0) {
        removeOyster(data.id);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[localX, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Vỏ hàu kích thước 15cm x 15cm */}
      <planeGeometry args={[1.5, 1.5]} />
      {/* Giữ nguyên màu trắng để texture hiển thị màu gốc của ảnh */}
      <meshStandardMaterial map={texture} transparent={true} color="#ffffff" roughness={0.7} side={THREE.DoubleSide} />

      {/* Nhãn thông số bẻ cong lại để dựng đứng vuông góc với mặt phẳng hàu */}
      <Html position={[0, 0, 1.0]} center rotation={[Math.PI / 2, 0, 0]}>
        <div className="bg-white/90 text-black px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap shadow-md border border-gray-300 transform -translate-y-full">
          <strong>ID: {data.id}</strong> <br /> {data.weight}g <br />
          {data.isDead === true ? <span className="text-red-600 font-bold">DEAD</span> : data.grade ? <span className="text-green-600 font-bold">Grade {data.grade}</span> : <span className="text-gray-500">Scanning...</span>}
        </div>
      </Html>
    </mesh>
  );
}
