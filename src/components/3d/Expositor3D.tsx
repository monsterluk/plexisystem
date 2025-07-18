// @ts-nocheck
import React from 'react';
import { CalculatorItem } from '@/types/Offer';

interface Expositor3DProps {
  item: CalculatorItem;
  materialColor?: string;
}

export const Expositor3D: React.FC<Expositor3DProps> = ({ item, materialColor = '#3b82f6' }) => {
  // Tymczasowa wersja bez Three.js - zwykła wizualizacja CSS 3D
  
  const width = item.dimensions.width / 10; // px
  const height = item.dimensions.height / 10;
  const depth = item.dimensions.depth / 10;

  return (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="relative" style={{ perspective: '1000px' }}>
        <div 
          className="relative transform-gpu transition-all duration-500 hover:rotate-y-180"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-20deg) rotateY(30deg)'
          }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 border-2"
            style={{
              backgroundColor: materialColor + '40',
              borderColor: materialColor,
              transform: `translateZ(${depth/2}px)`
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="text-white font-bold">{item.productName}</span>
            </div>
          </div>
          
          {/* Back */}
          <div 
            className="absolute inset-0 border-2"
            style={{
              backgroundColor: materialColor + '40',
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
          <p className="text-sm text-gray-600">Wymiary: {item.dimensions.width} × {item.dimensions.height} × {item.dimensions.depth} mm</p>
          <p className="text-xs text-gray-500 mt-2">Najedź myszką aby obrócić</p>
        </div>
      </div>
    </div>
  );
};