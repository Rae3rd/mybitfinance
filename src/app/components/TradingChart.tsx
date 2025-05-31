'use client';

import React from 'react';

const TradingChart = () => {
  return (
    <div className="bg-navy-800/50 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Real-time Trading Chart</h3>
      <div className="relative h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-600 rounded-md">
        <p>Interactive Chart Placeholder (e.g., TradingView, Chart.js)</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>Hover over the chart for interactive tooltips and price details.</p>
      </div>
    </div>
  );
};

export default TradingChart;