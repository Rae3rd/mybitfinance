'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartBarIcon, ArrowTrendingUpIcon as TrendingUpIcon, ArrowTrendingDownIcon as TrendingDownIcon, ArrowPathIcon as RefreshIcon } from '@heroicons/react/24/outline';

export default function MarketOverview() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  // Mock market data - replace with real API calls
  const marketData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2847.63, change: -15.23, changePercent: -0.53 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: 8.92, changePercent: 3.72 },
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change: 1250.00, changePercent: 2.98 },
    { symbol: 'ETH', name: 'Ethereum', price: 2650.75, change: -45.25, changePercent: -1.68 },
  ];

  // Handle refresh animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-navy-800 rounded-xl shadow-lg border border-navy-700 p-6 backdrop-blur-sm bg-opacity-80 hover:shadow-emerald-900/20 hover:shadow-lg transition-all duration-300">
      <motion.div 
        className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-xl font-semibold text-white flex items-center"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
          Live Market Data
        </motion.h2>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-1.5 rounded-full text-blue-500 hover:bg-navy-700 transition-colors"
          >
            <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
          <motion.button 
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="text-blue-500 hover:text-blue-400 text-sm font-medium flex items-center"
          >
            View All Markets
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {marketData.map((asset, index) => (
          <motion.div 
            key={asset.symbol} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(16, 24, 39, 0.5)' }}
            onClick={() => setSelectedAsset(selectedAsset === asset.symbol ? null : asset.symbol)}
            className="flex items-center justify-between p-3 rounded-lg transition-all duration-200 border border-transparent hover:border-navy-600 cursor-pointer relative overflow-hidden"
          >
            {/* Background gradient effect */}
            <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${asset.change >= 0 ? 'bg-gradient-to-r from-emerald-900/10 to-transparent' : 'bg-gradient-to-r from-red-900/10 to-transparent'} ${selectedAsset === asset.symbol ? 'opacity-100' : ''}`}></div>
            <div className="flex items-center space-x-3 z-10">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${asset.change >= 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                {asset.change >= 0 ? (
                  <TrendingUpIcon className="w-5 h-5" />
                ) : (
                  <TrendingDownIcon className="w-5 h-5" />
                )}
              </motion.div>
              <div>
                <p className="font-medium text-white flex items-center">
                  {asset.symbol}
                  {selectedAsset === asset.symbol && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    >
                      Selected
                    </motion.span>
                  )}
                </p>
                <p className="text-sm text-gray-400">{asset.name}</p>
              </div>
            </div>
            
            <div className="text-right z-10">
              <p className="font-medium text-white">
                ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <motion.div 
                className={`flex items-center justify-end space-x-1 text-sm ${
                  asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}
                animate={asset.change >= 0 ? 
                  { y: [0, -2, 0] } : 
                  { y: [0, 2, 0] }
                }
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <span>
                  {asset.change >= 0 ? '+' : ''}
                  ${Math.abs(asset.change).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span>({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%)</span>
                {asset.change >= 0 ? (
                  <TrendingUpIcon className="w-4 h-4 ml-1" />
                ) : (
                  <TrendingDownIcon className="w-4 h-4 ml-1" />
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
        
        <AnimatePresence>
          {selectedAsset && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 rounded-lg border border-navy-700 bg-navy-900/50"
            >
              <h3 className="text-sm font-medium text-white mb-2">Asset Details: {selectedAsset}</h3>
              <div className="text-xs text-gray-400">
                <p>Click on any asset to view more details. This section will be expanded with real-time charts and additional market data.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}