// @ts-nocheck
import React from 'react';
import { CalculatorItem } from '@/types/Offer';

interface Expositor3DProps {
  item: CalculatorItem;
  materialColor?: string;
}

export const Expositor3D: React.FC<Expositor3DProps> = ({ item, materialColor = '#f97316' }) => {
  // Tymczasowa wersja bez Three.js - zwykła wizualizacja CSS 3D
  
  const width = Math.min(item.dimensions.width / 5, 200); // px z limitem
  const height = Math.min(item.dimensions.height / 5, 200);
  const depth = Math.min(item.dimensions.depth / 5, 100);

  return (
    <div className="w-full h-[400px] bg-zinc-900 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="relative" style={{ perspective: '1000px' }}>
        <div 
          className="relative transform-gpu transition-all duration-1000 hover:scale-110"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-20deg) rotateY(30deg)',
            animation: 'rotate3d 10s infinite linear'
          }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 border-2 flex items-center justify-center"
            style={{
              backgroundColor: materialColor + '40',
              borderColor: materialColor,
              transform: `translateZ(${depth/2}px)`
            }}
          >
            <span className="text-white font-bold text-center px-2" style={{ fontSize: '10px' }}>
              {item.productName}
            </span>
          </div>
          
          {/* Back */}
          <div 
            className="absolute inset-0 border-2"
            style={{
              backgroundColor: materialColor + '30',
              borderColor: materialColor,
              transform: `translateZ(-${depth/2}px) rotateY(180deg)`
            }}
          />
          
          {/* Top */}
          <div 
            className="absolute border-2"
            style={{
              width: `${width}px`,
              height: `${depth}px`,
              backgroundColor: materialColor + '20',
              borderColor: materialColor,
              transform: `rotateX(90deg) translateZ(${height/2}px)`,
              transformOrigin: 'center bottom'
            }}
          />
          
          {/* Bottom */}
          <div 
            className="absolute border-2"
            style={{
              width: `${width}px`,
              height: `${depth}px`,
              backgroundColor: materialColor + '20',
              borderColor: materialColor,
              transform: `rotateX(-90deg) translateZ(${height/2}px)`,
              transformOrigin: 'center top'
            }}
          />
          
          {/* Left */}
          <div 
            className="absolute border-2"
            style={{
              width: `${depth}px`,
              height: `${height}px`,
              backgroundColor: materialColor + '30',
              borderColor: materialColor,
              transform: `rotateY(-90deg) translateZ(${width/2}px)`,
              transformOrigin: 'right center'
            }}
          />
          
          {/* Right */}
          <div 
            className="absolute border-2"
            style={{
              width: `${depth}px`,
              height: `${height}px`,
              backgroundColor: materialColor + '30',
              borderColor: materialColor,
              transform: `rotateY(90deg) translateZ(${width/2}px)`,
              transformOrigin: 'left center'
            }}
          />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">Wymiary: {item.dimensions.width} × {item.dimensions.height} × {item.dimensions.depth} mm</p>
          <p className="text-xs text-gray-500 mt-2">Model 3D • Materiał: {item.materialName}</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes rotate3d {
          0% {
            transform: rotateX(-20deg) rotateY(30deg);
          }
          100% {
            transform: rotateX(-20deg) rotateY(390deg);
          }
        }
      `}</style>
    </div>
  );
};