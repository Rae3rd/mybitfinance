'use client';

import { useState } from 'react';

// Define types for performance data
type PerformanceMetric = {
  value: number;
  change: number;
  changePercent: number;
};

type PerformanceData = {
  '1D': PerformanceMetric;
  '1W': PerformanceMetric;
  '1M': PerformanceMetric;
  '3M': PerformanceMetric;
  '1Y': PerformanceMetric;
  'ALL': PerformanceMetric;
  [key: string]: PerformanceMetric; // Add index signature for string keys
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<string>('1M'); // 1D, 1W, 1M, 3M, 1Y, ALL
  
  // Mock portfolio performance data
  const performanceData: PerformanceData = {
    '1D': { value: 24850.75, change: 345.25, changePercent: 1.41 },
    '1W': { value: 24850.75, change: -125.50, changePercent: -0.50 },
    '1M': { value: 24850.75, change: 1250.25, changePercent: 5.30 },
    '3M': { value: 24850.75, change: 2340.50, changePercent: 10.39 },
    '1Y': { value: 24850.75, change: 5670.25, changePercent: 29.54 },
    'ALL': { value: 24850.75, change: 14850.75, changePercent: 148.51 },
  };
  
  // Mock asset allocation data
  const assetAllocation = [
    { category: 'US Stocks', percentage: 45, value: 11182.84 },
    { category: 'International Stocks', percentage: 15, value: 3727.61 },
    { category: 'Cryptocurrencies', percentage: 25, value: 6212.69 },
    { category: 'Bonds', percentage: 10, value: 2485.08 },
    { category: 'Cash', percentage: 5, value: 1242.54 },
  ];
  
  // Mock sector breakdown data
  const sectorBreakdown = [
    { sector: 'Technology', percentage: 35, value: 8697.76 },
    { sector: 'Healthcare', percentage: 15, value: 3727.61 },
    { sector: 'Financial Services', percentage: 12, value: 2982.09 },
    { sector: 'Consumer Cyclical', percentage: 10, value: 2485.08 },
    { sector: 'Communication Services', percentage: 8, value: 1988.06 },
    { sector: 'Industrials', percentage: 7, value: 1739.55 },
    { sector: 'Energy', percentage: 5, value: 1242.54 },
    { sector: 'Other', percentage: 8, value: 1988.06 },
  ];
  
  // Mock historical performance data points (for chart)
  const chartData = [
    { date: '2023-01-01', value: 10000 },
    { date: '2023-02-01', value: 10800 },
    { date: '2023-03-01', value: 11200 },
    { date: '2023-04-01', value: 10900 },
    { date: '2023-05-01', value: 11500 },
    { date: '2023-06-01', value: 12200 },
    { date: '2023-07-01', value: 13100 },
    { date: '2023-08-01', value: 14000 },
    { date: '2023-09-01', value: 13500 },
    { date: '2023-10-01', value: 14200 },
    { date: '2023-11-01', value: 15100 },
    { date: '2023-12-01', value: 16300 },
    { date: '2024-01-01', value: 17800 },
    { date: '2024-02-01', value: 19200 },
    { date: '2024-03-01', value: 21500 },
    { date: '2024-04-01', value: 23600 },
    { date: '2024-05-01', value: 24850.75 },
  ];
  
  // Mock risk metrics
  const riskMetrics = {
    sharpeRatio: 1.8,
    volatility: 15.2,
    beta: 1.2,
    alpha: 5.4,
    maxDrawdown: -12.5,
  };
  
  // Calculate current performance based on selected time range
  const currentPerformance = performanceData[timeRange];
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Analytics</h1>
          <p className="mt-2 text-gray-600">
            In-depth analysis and insights about your investment portfolio.
          </p>
        </div>
        
        {/* Performance Overview Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
              <p className="text-gray-500 text-sm mt-1">Last updated: {new Date().toLocaleString()}</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="mt-4 md:mt-0 flex space-x-2">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${timeRange === range ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">${currentPerformance.value.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Total Change ({timeRange})</p>
              <p className={`text-2xl font-bold ${currentPerformance.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentPerformance.change >= 0 ? '+' : ''}
                ${Math.abs(currentPerformance.change).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Percentage Change ({timeRange})</p>
              <p className={`text-2xl font-bold ${currentPerformance.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentPerformance.changePercent >= 0 ? '+' : ''}
                {currentPerformance.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
          
          {/* Performance Chart (Placeholder) */}
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <p className="text-gray-500 text-sm">
              [Interactive Chart Would Be Displayed Here]
              <br />
              <span className="text-xs">This would be implemented with a charting library like Recharts or Chart.js</span>
            </p>
          </div>
          
          <div className="text-right">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Export Data →
            </button>
          </div>
        </div>
        
        {/* Asset Allocation & Sector Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Asset Allocation Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Asset Allocation</h2>
            
            {/* Asset Allocation Chart (Placeholder) */}
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <p className="text-gray-500 text-sm">
                [Pie Chart Would Be Displayed Here]
              </p>
            </div>
            
            {/* Asset Allocation Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocation
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assetAllocation.map((asset) => (
                    <tr key={asset.category}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {asset.category}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                        {asset.percentage}%
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                        ${asset.value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Sector Breakdown Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sector Breakdown</h2>
            
            {/* Sector Breakdown Chart (Placeholder) */}
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              <p className="text-gray-500 text-sm">
                [Bar Chart Would Be Displayed Here]
              </p>
            </div>
            
            {/* Sector Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allocation
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sectorBreakdown.map((sector) => (
                    <tr key={sector.sector}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {sector.sector}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                        {sector.percentage}%
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                        ${sector.value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Risk Analysis Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Analysis</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-gray-900">{riskMetrics.sharpeRatio.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Higher is better ({'>'}1 is good)</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Volatility</p>
              <p className="text-2xl font-bold text-gray-900">{riskMetrics.volatility.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Annual standard deviation</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Beta</p>
              <p className="text-2xl font-bold text-gray-900">{riskMetrics.beta.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Relative to S&P 500</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Alpha</p>
              <p className="text-2xl font-bold text-gray-900">{riskMetrics.alpha.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Excess return over benchmark</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold text-red-600">{riskMetrics.maxDrawdown.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Largest historical decline</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}