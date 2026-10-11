import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  className = '',
}) => {
  const getStyles = () => {
    switch (level) {
      case 'High':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'Low':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-700/20 text-slate-300 border-slate-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-[10px] px-1.5 py-0.5';
      case 'lg':
        return 'text-xs px-2.5 py-1 font-semibold';
      case 'md':
      default:
        return 'text-[11px] px-2 py-0.5 font-medium';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider rounded border ${getStyles()} ${getSizeClasses()} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          level === 'High'
            ? 'bg-rose-400'
            : level === 'Medium'
            ? 'bg-amber-400'
            : 'bg-emerald-400'
        }`}
      />
      {level} Risk
    </span>
  );
};
