'use client';

import React from 'react';

interface ProgressIndicatorProps {
  progress: number; // 0-100
  label: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  label,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full bg-gray-800 rounded-full h-4 relative overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 shadow-lg transition-all duration-500 ease-out"
        style={{ width: `${clampedProgress}%` }}
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 rounded-full opacity-75 animate-pulse"
          style={{
            boxShadow: `0 0 8px 2px rgba(52, 211, 153, 0.7), 0 0 16px 4px rgba(6, 182, 212, 0.5)`,
            filter: 'blur(4px)',
          }}
        ></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white text-shadow-sm">
        {label} ({clampedProgress}%)
      </div>
    </div>
  );
};

export default ProgressIndicator;