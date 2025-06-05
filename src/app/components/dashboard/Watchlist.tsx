'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, PlusIcon, ArrowTrendingUpIcon as TrendingUpIcon, ArrowTrendingDownIcon as TrendingDownIcon, EllipsisHorizontalIcon as DotsHorizontalIcon } from '@heroicons/react/24/outline';

export default function Watchlist() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState([
    { symbol: 'NVDA', price: 875.28, change: 12.45, changePercent: 1.44 },
    { symbol: 'MSFT', price: 378.85, change: -2.15, changePercent: -0.56 },
    { symbol: 'AMZN', price: 155.89, change: 3.22, changePercent: 2.11 },
  ]);

  const handleAddToWatchlist = () => {
    if (newSymbol.trim()) {
      // In a real app, you would fetch the actual price data for this symbol
      setWatchlist([
        ...watchlist,
        { 
          symbol: newSymbol.toUpperCase(), 
          price: Math.floor(Math.random() * 1000) + 100, 
          change: Math.floor(Math.random() * 20) - 10, 
          changePercent: parseFloat((Math.random() * 4 - 2).toFixed(2)) 
        }
      ]);
      setNewSymbol('');
      setShowAddForm(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-navy-800 rounded-xl shadow-lg border border-navy-700 p-6 backdrop-blur-sm bg-opacity-80 hover:shadow-emerald-900/20 hover:shadow-lg transition-all duration-300">
      <motion.div 
        className="absolute top-2 right-2 h-2 w-2 rounded-full bg-yellow-500"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-lg font-semibold text-white flex items-center"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
          Watchlist
        </motion.h2>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-yellow-500 hover:text-yellow-400 bg-navy-700/50 p-1.5 rounded-full"
        >
          <PlusIcon className="w-4 h-4" />
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex space-x-2 p-2 bg-navy-900/50 rounded-lg border border-navy-700">
              <input 
                type="text" 
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="Enter symbol (e.g. AAPL)"
                className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 focus:outline-none placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToWatchlist}
                className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-md text-xs font-medium border border-yellow-500/30"
              >
                Add
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {watchlist.map((asset, index) => (
          <motion.div 
            key={asset.symbol} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{ backgroundColor: 'rgba(16, 24, 39, 0.5)' }}
            onHoverStart={() => setIsHovering(asset.symbol)}
            onHoverEnd={() => setIsHovering(null)}
            className="flex items-center justify-between p-2 rounded-lg transition-all duration-200 relative overflow-hidden"
          >
            {/* Hover effect */}
            <AnimatePresence>
              {isHovering === asset.symbol && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-r from-navy-900/50 to-transparent z-0"
                />
              )}
            </AnimatePresence>
            
            <div className="z-10">
              <div className="flex items-center">
                <p className="font-medium text-white">{asset.symbol}</p>
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isHovering === asset.symbol ? 1 : 0, scale: isHovering === asset.symbol ? 1 : 0 }}
                  className="ml-2"
                >
                  <DotsHorizontalIcon className="w-4 h-4 text-gray-400" />
                </motion.div>
              </div>
              <p className="text-sm text-gray-400">${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            
            <div className="flex items-center space-x-2 z-10">
              <motion.div 
                className={`flex items-center text-sm ${
                  asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}
                animate={asset.change >= 0 ? 
                  { y: [0, -2, 0] } : 
                  { y: [0, 2, 0] }
                }
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <span>{asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%</span>
                {asset.change >= 0 ? (
                  <TrendingUpIcon className="w-4 h-4 ml-1" />
                ) : (
                  <TrendingDownIcon className="w-4 h-4 ml-1" />
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button 
        whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)' }}
        whileTap={{ y: 0 }}
        className="w-full mt-6 text-yellow-500 hover:text-yellow-400 text-sm font-medium py-2 border border-navy-700 rounded-lg bg-navy-900/30 transition-all duration-200 flex items-center justify-center"
      >
        <StarIcon className="w-4 h-4 mr-2" />
        Manage Watchlist
      </motion.button>
      
      {watchlist.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 rounded-lg border border-dashed border-navy-600 flex flex-col items-center justify-center"
        >
          <StarIcon className="w-8 h-8 text-navy-600 mb-2" />
          <p className="text-sm text-gray-400 text-center">Your watchlist is empty. Add symbols to track your favorite assets.</p>
        </motion.div>
      )}
    </motion.div>
  );
}