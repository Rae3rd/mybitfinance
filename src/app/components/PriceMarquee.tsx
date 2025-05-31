'use client';

import { useEffect, useState } from 'react';
import { AssetType, marketDataService } from '@/lib/market-data';

interface MarketPrice {
  symbol: string;
  price: number;
  change24h: number;
  error?: string;
}

export default function PriceMarquee() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Top assets to display in marquee
  const topAssets = [
    { symbol: 'BTC', type: AssetType.CRYPTO },
    { symbol: 'ETH', type: AssetType.CRYPTO },
    { symbol: 'AAPL', type: AssetType.STOCK },
    { symbol: 'GOOGL', type: AssetType.STOCK },
    { symbol: 'MSFT', type: AssetType.STOCK },
    { symbol: 'AMZN', type: AssetType.STOCK },
    { symbol: 'SOL', type: AssetType.CRYPTO },
    { symbol: 'TSLA', type: AssetType.STOCK },
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchPrices = async () => {
      try {
        setError(null);
        const pricePromises = topAssets.map(async (asset) => {
          try {
            const marketData = await marketDataService.getPrice(asset.symbol, asset.type);
            return {
              symbol: asset.symbol,
              price: marketData.currentPrice,
              change24h: marketData.change24h,
            };
          } catch (error) {
            console.error(`Error fetching price for ${asset.symbol}:`, error);
            // Return partial data with error
            return {
              symbol: asset.symbol,
              price: 0,
              change24h: 0,
              error: error instanceof Error ? error.message : 'Unknown error',
            };
          }
        });

        // Wait for all price fetches to complete
        const results = await Promise.all(pricePromises);
        
        if (isMounted) {
          setPrices(results);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error in price fetching:', err);
        if (isMounted) {
          setError('Failed to load market data');
          setIsLoading(false);
        }
      }
    };

    fetchPrices();

    // Refresh prices every 60 seconds
    const intervalId = setInterval(fetchPrices, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white py-2 overflow-hidden">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
          Loading market data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white py-2 overflow-hidden">
        <div className="text-red-400 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex space-x-8">
        {prices.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="font-semibold">{item.symbol}</span>
            <span className="text-gray-300">
              ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              className={`${item.change24h >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}
            >
              {item.change24h >= 0 ? '↑' : '↓'}
              {Math.abs(item.change24h).toFixed(2)}%
            </span>
            {item.error && <span className="text-red-400 text-xs">(!)</span>}
          </div>
        ))}
      </div>
    </div>
  );
}