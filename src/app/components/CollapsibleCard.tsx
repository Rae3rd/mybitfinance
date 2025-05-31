'use client';

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  initialOpen?: boolean;
  liveData?: string;
}

const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  children,
  initialOpen = false,
  liveData,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="bg-navy-900/50 backdrop-blur-lg rounded-xl border border-gray-700 overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 text-left text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{title}</span>
        <div className="flex items-center">
          {liveData && <span className="text-emerald-400 text-sm mr-3 animate-pulse-subtle">{liveData}</span>}
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 border-t border-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsibleCard;