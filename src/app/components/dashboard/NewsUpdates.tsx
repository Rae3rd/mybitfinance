'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon as RefreshIcon, NewspaperIcon, ArrowTopRightOnSquareIcon as ExternalLinkIcon, ChevronRightIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  url: string;
  category: string;
}

export default function NewsUpdates() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Mock categories
  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'economy', name: 'Economy' }
  ];

  // Mock news data - replace with API call
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockNews: NewsItem[] = [
          {
            id: '1',
            title: 'Federal Reserve Signals Potential Rate Cut',
            source: 'Financial Times',
            date: '2 hours ago',
            url: '#',
            category: 'economy'
          },
          {
            id: '2',
            title: 'Bitcoin Surges Past $60,000 on ETF Approval News',
            source: 'CryptoNews',
            date: '5 hours ago',
            url: '#',
            category: 'crypto'
          },
          {
            id: '3',
            title: 'Tech Stocks Rally as Earnings Beat Expectations',
            source: 'Market Watch',
            date: '1 day ago',
            url: '#',
            category: 'stocks'
          },
          {
            id: '4',
            title: 'New Regulations for DeFi Platforms Announced',
            source: 'Blockchain Report',
            date: '2 days ago',
            url: '#',
            category: 'crypto'
          },
          {
            id: '5',
            title: 'Global Markets Respond to Trade Agreement',
            source: 'Economic Review',
            date: '3 days ago',
            url: '#',
            category: 'economy'
          }
        ];
        
        setNews(mockNews);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch news'));
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    };

    fetchNews();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Re-fetch news
    const fetchNews = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Just toggle isRefreshing back off for demo
        setIsRefreshing(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to refresh news'));
        setIsRefreshing(false);
      }
    };

    fetchNews();
  };

  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-navy-800 rounded-xl shadow-lg border border-navy-700 p-6 backdrop-blur-sm bg-opacity-80 hover:shadow-emerald-900/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
    >
      {/* Animated dot indicator */}
      <motion.div 
        className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.h2 
          className="text-xl font-semibold text-white flex items-center"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <NewspaperIcon className="w-5 h-5 mr-2 text-emerald-500" />
          Market News
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-sm text-emerald-500 hover:text-emerald-400 disabled:opacity-50 flex items-center space-x-1 bg-navy-700/50 px-3 py-1.5 rounded-lg"
        >
          <RefreshIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Category filters */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-navy-600 scrollbar-track-transparent">
        {categories.map(category => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors ${activeCategory === category.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-navy-700/50 text-gray-400 border border-navy-600/50 hover:border-navy-500/50'}`}
          >
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* News content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-10 h-10 text-emerald-500"
            >
              <RefreshIcon className="w-10 h-10" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-gray-400"
            >
              Loading news...
            </motion.p>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 px-4"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="mx-auto w-12 h-12 text-red-500 mb-3"
            >
              <ExclamationCircleIcon className="w-12 h-12" />
            </motion.div>
            <p className="text-red-400 mb-3">{error.message}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="text-sm bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : filteredNews.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8 px-4 border border-dashed border-navy-600 rounded-lg"
          >
            <NewspaperIcon className="w-10 h-10 text-navy-600 mx-auto mb-2" />
            <p className="text-gray-400">
              No news found for this category
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="news-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filteredNews.map((item) => (
              <motion.a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                key={item.id}
                variants={itemVariants}
                whileHover={{ backgroundColor: 'rgba(16, 24, 39, 0.5)', x: 5 }}
                className="flex items-center justify-between p-3 rounded-lg border border-navy-700/50 hover:border-navy-600 transition-all duration-200 relative overflow-hidden group"
              >
                {/* Background gradient effect */}
                <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-emerald-900/20 to-transparent"></div>
                
                <div className="flex-1 min-w-0 z-10">
                  <h3 className="text-white text-sm font-medium truncate group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <span className="truncate">{item.source}</span>
                    <span className="mx-1.5">•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                
                <motion.div 
                  className="ml-4 text-emerald-500"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </motion.div>
              </motion.a>
            ))}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-3 text-center"
            >
              <motion.a 
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs inline-flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <span>View All News</span>
                <ExternalLinkIcon className="w-3 h-3 ml-1" />
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}