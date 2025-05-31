'use client';

import { useState } from 'react';

export default function MarketData() {
  const [activeTab, setActiveTab] = useState('stocks');
  
  // Mock market data - would be replaced with real API data
  const stocksData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35, marketCap: '2.85T', volume: '58.4M' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 328.79, change: 4.21, changePercent: 1.29, marketCap: '2.44T', volume: '23.1M' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2847.63, change: -15.23, changePercent: -0.53, marketCap: '1.78T', volume: '1.2M' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 132.83, change: 1.56, changePercent: 1.19, marketCap: '1.37T', volume: '35.7M' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: 8.92, changePercent: 3.72, marketCap: '789.5B', volume: '118.2M' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 472.22, change: -3.18, changePercent: -0.67, marketCap: '1.21T', volume: '14.3M' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 824.18, change: 15.32, changePercent: 1.89, marketCap: '2.03T', volume: '42.8M' },
    { symbol: 'BRK.A', name: 'Berkshire Hathaway', price: 528470.00, change: 1250.00, changePercent: 0.24, marketCap: '768.2B', volume: '1.1K' },
  ];
  
  const cryptoData = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change: 1250.00, changePercent: 2.98, marketCap: '845.2B', volume: '28.4B' },
    { symbol: 'ETH', name: 'Ethereum', price: 2650.75, change: -45.25, changePercent: -1.68, marketCap: '318.7B', volume: '15.2B' },
    { symbol: 'BNB', name: 'Binance Coin', price: 567.32, change: 12.45, changePercent: 2.24, marketCap: '87.5B', volume: '2.1B' },
    { symbol: 'SOL', name: 'Solana', price: 102.78, change: 5.32, changePercent: 5.46, marketCap: '44.3B', volume: '3.8B' },
    { symbol: 'ADA', name: 'Cardano', price: 0.58, change: -0.02, changePercent: -3.33, marketCap: '20.5B', volume: '1.2B' },
    { symbol: 'XRP', name: 'Ripple', price: 0.62, change: 0.03, changePercent: 5.08, marketCap: '33.8B', volume: '2.4B' },
    { symbol: 'DOT', name: 'Polkadot', price: 7.84, change: 0.18, changePercent: 2.35, marketCap: '9.8B', volume: '421.5M' },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.12, change: 0.01, changePercent: 9.09, marketCap: '17.2B', volume: '1.8B' },
  ];
  
  const displayData = activeTab === 'stocks' ? stocksData : cryptoData;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market Data</h1>
          <p className="mt-2 text-gray-600">
            Real-time prices and market information for stocks and cryptocurrencies.
          </p>
        </div>
        
        {/* Market Overview Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2>
              <p className="text-gray-500 text-sm mt-1">Last updated: {new Date().toLocaleString()}</p>
            </div>
            
            {/* Search Bar */}
            <div className="mt-4 md:mt-0">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 pl-10 pr-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Search by symbol or name..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('stocks')}
                className={`${activeTab === 'stocks' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Stocks
              </button>
              <button
                onClick={() => setActiveTab('crypto')}
                className={`${activeTab === 'crypto' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Cryptocurrencies
              </button>
            </nav>
          </div>
          
          {/* Market Data Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    24h Change
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume (24h)
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((asset) => (
                  <tr key={asset.symbol} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {asset.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.change >= 0 ? '+' : ''}{asset.change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({asset.change >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      ${asset.marketCap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {asset.volume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Add to Portfolio</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Market Insights Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Top Gainers</h3>
              <ul className="space-y-3">
                {displayData
                  .filter(asset => asset.change > 0)
                  .sort((a, b) => b.changePercent - a.changePercent)
                  .slice(0, 3)
                  .map(asset => (
                    <li key={`gainer-${asset.symbol}`} className="flex justify-between items-center">
                      <span className="text-gray-800">{asset.symbol} - {asset.name}</span>
                      <span className="text-green-600 font-medium">+{asset.changePercent.toFixed(2)}%</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Top Losers</h3>
              <ul className="space-y-3">
                {displayData
                  .filter(asset => asset.change < 0)
                  .sort((a, b) => a.changePercent - b.changePercent)
                  .slice(0, 3)
                  .map(asset => (
                    <li key={`loser-${asset.symbol}`} className="flex justify-between items-center">
                      <span className="text-gray-800">{asset.symbol} - {asset.name}</span>
                      <span className="text-red-600 font-medium">{asset.changePercent.toFixed(2)}%</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}