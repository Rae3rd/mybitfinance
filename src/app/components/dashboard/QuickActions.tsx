'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BanknotesIcon as CashIcon, ChartBarIcon, MagnifyingGlassIcon as SearchIcon, BoltIcon as LightningBoltIcon } from '@heroicons/react/24/outline';

export default function QuickActions() {
  const [activeAction, setActiveAction] = useState<number | null>(null);
  const actions = [
    {
      title: 'Add Investment',
      description: 'Buy stocks or crypto',
      icon: <CashIcon className="w-5 h-5" />,
      color: 'from-emerald-500 to-emerald-600',
      hoverEffect: { y: -5, boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' },
    },
    {
      title: 'View Portfolio',
      description: 'Detailed analysis',
      icon: <ChartBarIcon className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      hoverEffect: { y: -5, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' },
    },
    {
      title: 'Market Research',
      description: 'Explore opportunities',
      icon: <SearchIcon className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      hoverEffect: { y: -5, boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.3)' },
    },
    {
      title: 'Quick Trade',
      description: 'Execute trades instantly',
      icon: <LightningBoltIcon className="w-5 h-5" />,
      color: 'from-yellow-500 to-yellow-600',
      hoverEffect: { y: -5, boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)' },
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-navy-800 rounded-xl shadow-lg border border-navy-700 p-6 backdrop-blur-sm bg-opacity-80 hover:shadow-emerald-900/20 hover:shadow-lg transition-all duration-300">
      <motion.div 
        className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-500"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.h2 
        className="text-lg font-semibold text-white mb-6 flex items-center"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LightningBoltIcon className="w-5 h-5 mr-2 text-purple-500" />
        Quick Actions
      </motion.h2>
      
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={action.hoverEffect}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setActiveAction(index)}
            onHoverEnd={() => setActiveAction(null)}
            className="w-full flex items-center space-x-3 p-4 rounded-lg border border-navy-700 bg-navy-900/30 hover:border-navy-600 transition-all duration-300 text-left relative overflow-hidden"
          >
            {/* Background gradient that appears on hover */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0`}
              animate={{ opacity: activeAction === index ? 0.1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <motion.div 
              className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center text-white shadow-lg`}
              animate={{ rotate: activeAction === index ? [0, 5, -5, 0] : 0 }}
              transition={{ duration: 0.5 }}
            >
              {action.icon}
            </motion.div>
            <div className="z-10">
              <p className="font-medium text-white">{action.title}</p>
              <p className="text-sm text-gray-400">{action.description}</p>
            </div>
            
            {/* Arrow that appears on hover */}
            <motion.div 
              className="ml-auto mr-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: activeAction === index ? 1 : 0, x: activeAction === index ? 0 : -10 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}