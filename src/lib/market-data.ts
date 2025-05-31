// Define AssetType enum locally to avoid dependency on @prisma/client in client components
export enum AssetType {
  STOCK = 'STOCK',
  CRYPTO = 'CRYPTO'
}

export interface MarketData {
  currentPrice: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  lastUpdated: Date;
}

export interface DetailedMarketData extends MarketData {
  high24h: number;
  low24h: number;
  priceHistory: {
    timestamp: Date;
    price: number;
  }[];
}

export class MarketDataService {
  private static instance: MarketDataService;
  private cache: Map<string, MarketData>;
  private cacheTimeout = 3600000; // 1 hour cache
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second
  private finnhubApiKey = 'd0sreihr01qid5qauj8gd0sreihr01qid5qauj90';

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  private async fetchStockPrice(symbol: string, retryCount = 0): Promise<MarketData> {
    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${this.finnhubApiKey}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MyBitFinance/1.0.0'
        }
      });

      if (response.status === 429) {
        if (retryCount < this.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
          return this.fetchStockPrice(symbol, retryCount + 1);
        }
        throw new Error('API rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || typeof data.c === 'undefined') {
        throw new Error(`No data available for ${symbol}`);
      }

      return {
        currentPrice: data.c || 0, // Current price
        change24h: ((data.c - data.pc) / data.pc) * 100 || 0, // Percentage change
        volume24h: data.v || 0, // Volume
        lastUpdated: new Date()
      };
    } catch (error) {
      if (retryCount < this.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retryCount + 1)));
        return this.fetchStockPrice(symbol, retryCount + 1);
      }
      throw new Error(`Failed to fetch stock data for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchCryptoPrice(symbol: string, retryCount = 0): Promise<MarketData> {
    const symbolToId: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'SOL': 'solana',
      'DOGE': 'dogecoin',
      'XRP': 'ripple',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'LINK': 'chainlink'
    };

    const coinId = symbolToId[symbol];
    if (!coinId) {
      throw new Error(`Unsupported crypto symbol: ${symbol}`);
    }

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'MyBitFinance/1.0.0'
          }
        }
      );

      if (response.status === 429) {
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
          return this.fetchCryptoPrice(symbol, retryCount + 1);
        }
        throw new Error('API rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data[coinId]) {
        if (retryCount < 3) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
          return this.fetchCryptoPrice(symbol, retryCount + 1);
        }
        throw new Error(`No data returned for ${symbol}`);
      }

      const cryptoData = data[coinId];
      return {
        currentPrice: cryptoData.usd || 0,
        change24h: cryptoData.usd_24h_change || 0,
        volume24h: cryptoData.usd_24h_vol || 0,
        marketCap: cryptoData.usd_market_cap || 0,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error(`Error fetching crypto data for ${symbol}:`, error);
      throw new Error(`Failed to fetch crypto data for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async getPrice(symbol: string, type: string | AssetType): Promise<MarketData> {
    const cacheKey = `${type}_${symbol}`;
    const cachedData = this.cache.get(cacheKey);

    if (cachedData && (new Date().getTime() - cachedData.lastUpdated.getTime()) < this.cacheTimeout) {
      return cachedData;
    }

    try {
      const data = type === AssetType.STOCK || type === 'STOCK'
        ? await this.fetchStockPrice(symbol)
        : await this.fetchCryptoPrice(symbol);
      
      this.cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching market data for ${symbol}:`, error);
      throw error;
    }
  }

  public async getDetailedData(symbol: string, type: string | AssetType): Promise<DetailedMarketData> {
    // Implement detailed data fetching with historical prices
    // This would use additional API endpoints for historical data
    throw new Error('Not implemented yet');
  }
}

export const marketDataService = MarketDataService.getInstance();