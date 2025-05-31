'use client';

import React from 'react';

const DynamicPortfolioGraph = () => {
  return (
    <div className="bg-navy-800/50 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Dynamic Portfolio Performance</h3>
      <div className="relative h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-600 rounded-md">
        <p>Portfolio Performance Graph Placeholder</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-32 h-32 text-cyan-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>Interactive graph showing your portfolio's historical performance.</p>
      </div>
    </div>
  );
};

export default DynamicPortfolioGraph;