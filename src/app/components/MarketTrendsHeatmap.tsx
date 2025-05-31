'use client';

import React from 'react';

const MarketTrendsHeatmap = () => {
  return (
    <div className="bg-navy-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Market Trends Heatmap</h3>
      <div className="relative h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-600 rounded-md">
        <p>Heatmap Visualization Placeholder</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-5 gap-2 w-full h-full p-4">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-red-500 to-purple-600 opacity-20 rounded-sm animate-pulse"
                style={{ animationDelay: `${i * 0.05}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>Visual representation of market sentiment and trends.</p>
      </div>
    </div>
  );
};

export default MarketTrendsHeatmap;