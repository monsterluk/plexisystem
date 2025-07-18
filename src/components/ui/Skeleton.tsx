import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  count = 1
}) => {
  const baseClasses = 'bg-zinc-700/50 animate-pulse';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style = {
    width: width || (variant === 'circular' ? '40px' : '100%'),
    height: height || (variant === 'circular' ? '40px' : variant === 'rectangular' ? '200px' : '16px')
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${baseClasses} ${variantClasses[variant]} ${className} ${count > 1 ? 'mb-2' : ''}`}
          style={style}
        />
      ))}
    </>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-zinc-800/50 backdrop-blur rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton width="60%" className="mb-2" />
          <Skeleton width="40%" />
        </div>
      </div>
      <Skeleton count={3} className="mb-2" />
      <div className="flex gap-2 mt-4">
        <Skeleton width={80} height={32} variant="rectangular" className="rounded-lg" />
        <Skeleton width={80} height={32} variant="rectangular" className="rounded-lg" />
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-zinc-800/50 backdrop-blur rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-700/50">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="80%" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 border-b border-zinc-700/30">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                width={colIndex === 0 ? "60%" : "90%"}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};