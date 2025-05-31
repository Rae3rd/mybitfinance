'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface NewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch news: ${response.status}`);
        }

        const data = await response.json();
        setNews(data.slice(0, 6)); // Display top 6 news items
        setIsLoading(false);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching news:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch news');
        setIsLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 3600000); // Update every hour

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center text-red-400">
          <p>Error loading market news: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-navy-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-grid"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400 mb-6">
            Market News & Updates
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay informed with the latest market insights and financial news
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-navy-800/50 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 transform hover:-translate-y-2 group"
            >
              {item.image && (
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.headline}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <span className="text-emerald-400 text-sm">{item.source}</span>
                <span className="text-gray-400 text-sm">
                  {new Date(item.datetime * 1000).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                {item.headline}
              </h3>
              <p className="text-gray-300 line-clamp-3">{item.summary}</p>
              <div className="mt-4 flex items-center text-emerald-400 group-hover:text-emerald-300 transition-colors">
                <span>Read more</span>
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}