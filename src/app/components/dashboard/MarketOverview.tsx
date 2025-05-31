'use client';

export default function MarketOverview() {
  // Mock market data - replace with real API calls
  const marketData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34, changePercent: 1.35 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2847.63, change: -15.23, changePercent: -0.53 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: 8.92, changePercent: 3.72 },
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change: 1250.00, changePercent: 2.98 },
    { symbol: 'ETH', name: 'Ethereum', price: 2650.75, change: -45.25, changePercent: -1.68 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Live Market Data</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All Markets →
        </button>
      </div>

      <div className="space-y-4">
        {marketData.map((asset) => (
          <div key={asset.symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {asset.symbol.slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{asset.symbol}</p>
                <p className="text-sm text-gray-500">{asset.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-medium text-gray-900">
                ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <div className={`flex items-center space-x-1 text-sm ${
                asset.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>
                  {asset.change >= 0 ? '+' : ''}
                  ${Math.abs(asset.change).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span>({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}