// src/components/ui/Card.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  icon: Icon,
  title,
  subtitle,
  isActive = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border-2 transition-all text-left w-full
        ${isActive 
          ? 'border-orange-500 bg-orange-500/10' 
          : 'border-zinc-700 hover:border-zinc-600'
        }
        ${className}
      `}
    >
      {Icon && (
        <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
      )}
      <p className="font-medium">{title}</p>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </button>
  );
};