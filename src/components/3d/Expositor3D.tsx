// @ts-nocheck
import React, { useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Text, Environment, PerspectiveCamera } from '@react-three/drei';
import { CalculatorItem } from '@/types/Offer';

interface Expositor3DProps {
  item: CalculatorItem;
  materialColor?: string;
}

// Komponent ekspozytora 3D
const Expositor: React.FC<{ item: CalculatorItem; color: string }> = ({ item, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animacja rotacji
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const width = item.dimensions.width / 1000; // mm to m
  const height = item.dimensions.height / 1000;
  const depth = item.dimensions.depth / 1000;

  // Funkcja renderująca różne typy ekspozytorów
  const renderExpositor = () => {
    switch (item.expositorType) {
      case 'podstawkowy':
        return (
          <group ref={meshRef}>
            {/* Podstawa */}
            <Box args={[width, 0.05, depth]} position={[0, 0.025, 0]}>
              <meshStandardMaterial color={color} transparent opacity={0.8} />
            </Box>
            {/* Tył */}
            <Box args={[width, height, 0.05]} position={[0, height/2, -depth/2 + 0.025]}>
              <meshStandardMaterial color={color} transparent opacity={0.8} />
            </Box>
            {/* Boki */}
            <Box args={[0.05, height, depth]} position={[-width/2 + 0.025, height/2, 0]}>
              <meshStandardMaterial color={color} transparent opacity={0.8} />
            </Box>
            <Box args={[0.05, height, depth]} position={[width/2 - 0.025, height/2, 0]}>
              <meshStandardMaterial color={color} transparent opacity={0.8} />
            </Box>
            {/* Topper jeśli wybrany */}
            {item.options.topper && (
              <Box args={[width, height * 0.2, 0.05]} position={[0, height + height * 0.1, -depth/2 + 0.025]}>
                <meshStandardMaterial color="#ff6b35" />
              </Box>
            )}
          </group>
        );

      case 'schodkowy':
        const steps = item.productParams.shelves || 3;
        const stepHeight = height / steps;
        const stepDepth = depth / steps;
        
        return (
          <group ref={meshRef}>
            {/* Tył */}
            <Box args={[width, height, 0.05]} position={[0, height/2, -depth/2 + 0.025]}>
              <meshStandardMaterial color={color} transparent opacity={0.8} />
            </Box>
            {/* Schody */}
            {Array.from({ length: steps }).map((_, i) => (
              <Box 
                key={i}
                args={[width, 0.05, stepDepth]} 
                position={[0, (i + 1) * stepHeight - 0.025, -depth/2 + stepDepth/2 + i * stepDepth]}
              >
                <meshStandardMaterial color={color} transparent opacity={0.8} />
              </Box>
            ))}
          </group>
        );

      case 'z_haczykami':
        const rows = item.productParams.hookRows || 3;
        const cols = item.productParams.hookCols || 4;
        
        return (
          <group ref={meshRef}>
            {/* Panel główny */}
            <Box args={[width, height, 0.05]} position={[0, height/2, 0]}>
              <meshStandardMaterial color={color} transparent opacity={0.8} />
            </Box>
            {/* Haczyki */}
            {Array.from({ length: rows }).map((_, row) =>
              Array.from({ length: cols }).map((_, col) => (
                <Box
                  key={`${row}-${col}`}
                  args={[0.02, 0.1, 0.05]}
                  position={[
                    (col - (cols - 1) / 2) * (width / cols),
                    height - (row + 1) * (height / (rows + 1)),
                    0.05
                  ]}
                >
                  <meshStandardMaterial color="#333" />
                </Box>
              ))
            )}
          </group>
        );

      default:
        // Formatka lub podstawowy box
        return (
          <Box ref={meshRef} args={[width, height, item.product === 'formatka' ? 0.01 : depth]}>
            <meshStandardMaterial color={color} transparent opacity={0.8} />
          </Box>
        );
    }
  };

  return renderExpositor();
};

export const Expositor3D: React.FC<Expositor3DProps> = ({ item, materialColor = '#3b82f6' }) => {
  // Mapowanie materiałów na kolory
  const getMaterialColor = () => {
    switch (item.material) {
      case 'plexi': return '#e3f2fd';
      case 'plexi_satyna': return '#bbdefb';
      case 'plexi_color': return materialColor;
      case 'plexi_opal': return '#f5f5f5';
      case 'petg': return '#e8f5e9';
      case 'poliweg': return '#fff3e0';
      case 'dibond': return '#9e9e9e';
      default: return '#3b82f6';
    }
  };

  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
      <Canvas>
        <PerspectiveCamera makeDefault position={[2, 2, 2]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {/* Oświetlenie */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        {/* Environment dla realistycznych odbić */}
        <Environment preset="studio" />
        
        {/* Model ekspozytora */}
        <Suspense fallback={null}>
          <Expositor item={item} color={getMaterialColor()} />
        </Suspense>
        
        {/* Siatka pomocnicza */}
        <gridHelper args={[5, 50, '#888', '#444']} />
      </Canvas>
    </div>
  );
};