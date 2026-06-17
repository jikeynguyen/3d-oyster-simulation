

interface ConveyorBeltProps {
  position: [number, number, number];
  length: number;
  width: number;
  color?: string;
}

export function ConveyorBelt({ position, length, width, color = '#333333' }: ConveyorBeltProps) {
  return (
    <group position={position}>
      {/* Thân băng tải */}
      <mesh position={[length / 2, -0.25, 0]}>
        <boxGeometry args={[length, 0.5, width]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
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
    </group>
  );
}
