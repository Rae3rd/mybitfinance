'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, ArrowUpIcon, ArrowDownIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex flex-col items-end space-y-3 mb-3">
        {isOpen && (
          <>
            <Link href="/deposit" className="flex items-center bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-110" aria-label="Deposit">
              <ArrowUpIcon className="w-6 h-6" />
            </Link>
            <Link href="/withdraw" className="flex items-center bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-110" aria-label="Withdraw">
              <ArrowDownIcon className="w-6 h-6" />
            </Link>
            <Link href="/trade" className="flex items-center bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-110" aria-label="Trade">
              <CurrencyDollarIcon className="w-6 h-6" />
            </Link>
          </>
        )}
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-110"
        aria-label="Main action button"
      >
        <PlusIcon className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
      </button>
    </div>
  );
};

export default FloatingActionButton;