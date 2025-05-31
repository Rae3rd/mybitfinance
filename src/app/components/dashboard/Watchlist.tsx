'use client';

import { useState } from 'react';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([
    { symbol: 'NVDA', price: 875.28, change: 12.45, changePercent: 1.44 },
    { symbol: 'MSFT', price: 378.85, change: -2.15, changePercent: -0.56 },
    { symbol: 'AMZN', price: 155.89, change: 3.22, changePercent: 2.11 },
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Watchlist</h2>
        <button className="text-blue-600 hover:text-blue-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {watchlist.map((asset) => (
          <div key={asset.symbol} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{asset.symbol}</p>
              <p className="text-sm text-gray-500">${asset.price}</p>
            </div>
            <div className={`text-right text-sm ${
              asset.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <p>{asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
        Manage Watchlist
      </button>
    </div>
  );
}