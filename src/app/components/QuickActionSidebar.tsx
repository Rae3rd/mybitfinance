'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, ChartBarIcon, WalletIcon, Cog6ToothIcon, QuestionMarkCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const QuickActionSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 text-white p-3 rounded-l-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-all duration-300 hover:bg-emerald-700"
        aria-label="Toggle quick actions"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path></svg>
        )}
      </button>

      <div
        className={`fixed right-0 top-0 h-full bg-navy-900/90 backdrop-blur-xl shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'} w-64 p-6 flex flex-col justify-center`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
          aria-label="Close quick actions"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <nav className="space-y-6 text-lg">
          <Link href="/dashboard" className="flex items-center text-gray-300 hover:text-emerald-400 transition-colors group">
            <HomeIcon className="w-7 h-7 mr-4 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
            Dashboard
          </Link>
          <Link href="/portfolio" className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors group">
            <WalletIcon className="w-7 h-7 mr-4 text-cyan-500 group-hover:text-cyan-400 transition-colors" />
            Portfolio
          </Link>
          <Link href="/market" className="flex items-center text-gray-300 hover:text-purple-400 transition-colors group">
            <ChartBarIcon className="w-7 h-7 mr-4 text-purple-500 group-hover:text-purple-400 transition-colors" />
            Market
          </Link>
          <Link href="/settings" className="flex items-center text-gray-300 hover:text-yellow-400 transition-colors group">
            <Cog6ToothIcon className="w-7 h-7 mr-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            Settings
          </Link>
          <Link href="/help" className="flex items-center text-gray-300 hover:text-blue-400 transition-colors group">
            <QuestionMarkCircleIcon className="w-7 h-7 mr-4 text-blue-500 group-hover:text-blue-400 transition-colors" />
            Help
          </Link>
          <Link href="/security" className="flex items-center text-gray-300 hover:text-red-400 transition-colors group">
            <ShieldCheckIcon className="w-7 h-7 mr-4 text-red-500 group-hover:text-red-400 transition-colors" />
            Security
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default QuickActionSidebar;