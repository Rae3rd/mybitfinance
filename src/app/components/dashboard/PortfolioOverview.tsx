'use client';

import { useState } from 'react';

export default function PortfolioOverview() {
  const [timeframe, setTimeframe] = useState('1D');
  
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Portfolio Overview</h2>
        <div className="flex space-x-2">
          {['1D', '1W', '1M', '1Y'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeframe === period
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-3">
          <h3 className="text-3xl font-bold text-gray-900">
            ${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h3>
          <div className={`flex items-center space-x-1 ${
            portfolioData.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="text-lg font-medium">
              {portfolioData.dailyChange >= 0 ? '+' : ''}
              ${Math.abs(portfolioData.dailyChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm">
              ({portfolioData.dailyChangePercent >= 0 ? '+' : ''}{portfolioData.dailyChangePercent}%)
            </span>
            <svg className={`w-4 h-4 ${
              portfolioData.dailyChange >= 0 ? 'rotate-0' : 'rotate-180'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-1">Total Portfolio Value</p>
      </div>

      {/* Allocation Chart */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Asset Allocation</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Stocks</span>
              </div>
              <span className="text-sm font-medium">{portfolioData.allocation.stocks}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Crypto</span>
              </div>
              <span className="text-sm font-medium">{portfolioData.allocation.crypto}%</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Performance</h4>
          <div className="h-20 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
            <span className="text-xs text-gray-500">Chart placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}