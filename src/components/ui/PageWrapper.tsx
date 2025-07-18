import React from 'react';
import { motion } from 'framer-motion';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showGradient?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  title, 
  subtitle, 
  actions,
  showGradient = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-slate-900">
      {showGradient && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
        </div>
      )}
      
      <div className="relative">
        {(title || subtitle || actions) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800"
          >
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex justify-between items-start">
                <div>
                  {title && (
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-lg text-gray-400 mt-2 max-w-2xl">
                      {subtitle}
                    </p>
                  )}
                </div>
                {actions && (
                  <div className="flex gap-3">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}> = ({ children, className = '', hover = true, gradient = false }) => {
  const baseClasses = "bg-zinc-800/50 backdrop-blur-xl rounded-2xl border border-zinc-700/50";
  const hoverClasses = hover ? "hover:border-purple-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10" : "";
  const gradientClasses = gradient ? "bg-gradient-to-br from-purple-900/20 to-pink-900/20" : "";
  
  return (
    <motion.div 
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const SectionTitle: React.FC<{
  icon?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ icon, children, action }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        {icon && <span className="text-purple-400">{icon}</span>}
        {children}
      </h2>
      {action}
    </div>
  );
};

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-16">
      <div className="inline-flex p-4 bg-zinc-800 rounded-2xl mb-4">
        <span className="text-gray-500">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
};

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 absolute inset-0 animation-delay-150"></div>
      </div>
    </div>
  );
};

export const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  color?: 'purple' | 'emerald' | 'amber' | 'blue' | 'red';
  progress?: number;
}> = ({ icon, label, value, trend, color = 'purple', progress }) => {
  const colorClasses = {
    purple: 'from-purple-500 to-pink-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    blue: 'from-blue-500 to-indigo-500',
    red: 'from-red-500 to-rose-500',
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg`}>
          <span className="text-white">{icon}</span>
        </div>
        {trend && (
          <span className={`text-sm font-bold flex items-center gap-1 ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {progress !== undefined && (
        <div className="mt-4 h-2 bg-zinc-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          />
        </div>
      )}
    </Card>
  );
};