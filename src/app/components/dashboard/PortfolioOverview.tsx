'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, ArrowPathIcon as RefreshIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function PortfolioOverview() {
  const [timeframe, setTimeframe] = useState('1D');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Mock data - replace with real API calls
  const portfolioData = {
    totalValue: 125420.50,
    dailyChange: 2340.20,
    dailyChangePercent: 1.9,
    allocation: {
      stocks: 65,
      crypto: 35
    }
  };

  // Handle refresh animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="bg-navy-800 rounded-xl shadow-lg border border-navy-700 p-6 backdrop-blur-sm bg-opacity-80 hover:shadow-emerald-900/20 hover:shadow-lg transition-all duration-300">
      {/* Use motion components inside the parent div */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <motion.div 
          className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-6 h-6 text-emerald-500 mr-2" />
            <h2 className="text-xl font-semibold text-white">Portfolio Overview</h2>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center space-x-1 bg-navy-700/50 px-3 py-1.5 rounded-lg"
          >
            <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </motion.button>
        </div>
        
        {/* Portfolio Value */}
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-1">Total Portfolio Value</p>
          <div className="flex items-end">
            <h3 className="text-3xl font-bold text-white">${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center ml-3 mb-1">
              <div className={`flex items-center ${portfolioData.dailyChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {portfolioData.dailyChange >= 0 ? 
                  <ArrowUpIcon className="w-3 h-3 mr-1" /> : 
                  <ArrowDownIcon className="w-3 h-3 mr-1" />
                }
                <span className="text-sm font-medium">${Math.abs(portfolioData.dailyChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <span className={`text-xs ml-1 ${portfolioData.dailyChangePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                ({portfolioData.dailyChangePercent >= 0 ? '+' : ''}{portfolioData.dailyChangePercent}%)
              </span>
            </div>
          </div>
        </div>
        
        {/* Timeframe Selection */}
        <div className="flex space-x-2 mb-6">
          {['1D', '1W', '1M', '3M', 'YTD', '1Y', 'All'].map((time) => (
            <motion.button
              key={time}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              onClick={() => setTimeframe(time)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${timeframe === time ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-navy-700/50 text-gray-400 border border-transparent hover:border-navy-600'}`}
            >
              {time}
            </motion.button>
          ))}
        </div>
        
        {/* Performance Chart */}
        <div className="relative h-48 mb-6">
          {/* Placeholder for chart - replace with actual chart component */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-lg border border-navy-700/50">
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
            
            {/* Sample chart line */}
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M0,50 Q20,45 30,48 T50,40 T70,50 T100,30"
                fill="none"
                stroke="#10B981"
                strokeWidth="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                className="drop-shadow-md"
              />
              
              {/* Highlight point */}
              <motion.circle
                cx="70"
                cy="50"
                r="2"
                fill="#10B981"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="cursor-pointer"
              />
            </svg>
            
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-navy-700 text-white text-xs p-2 rounded-md shadow-lg border border-navy-600 z-10"
                >
                  <p className="font-medium">June 15, 2023</p>
                  <p className="text-emerald-500">$124,580.30</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Asset Allocation */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <ChartBarIcon className="w-4 h-4 text-emerald-500 mr-1" />
              <h3 className="text-sm font-medium text-white">Asset Allocation</h3>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Stocks */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Stocks</span>
                <span className="text-white">{portfolioData.allocation.stocks}%</span>
              </div>
              <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${portfolioData.allocation.stocks}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                />
              </div>
            </div>
            
            {/* Crypto */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Crypto</span>
                <span className="text-white">{portfolioData.allocation.crypto}%</span>
              </div>
              <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${portfolioData.allocation.crypto}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}