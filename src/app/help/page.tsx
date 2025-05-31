'use client';

import { useState } from 'react';
import Link from 'next/link';

// Define types for help articles
type HelpArticle = {
  id: string;
  title: string;
  views: number;
  category?: string; // Optional for popular articles
};

type HelpArticlesData = {
  'getting-started': HelpArticle[];
  'account': HelpArticle[];
  'portfolio': HelpArticle[];
  'market-data': HelpArticle[];
  'security': HelpArticle[];
  'billing': HelpArticle[];
  [key: string]: HelpArticle[]; // Add index signature for string keys
};

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  
  // Help categories and articles
  const helpCategories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account Management', icon: '👤' },
    { id: 'portfolio', name: 'Portfolio Management', icon: '📊' },
    { id: 'market-data', name: 'Market Data', icon: '📈' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'billing', name: 'Billing & Subscription', icon: '💳' },
  ];
  
  const helpArticles: HelpArticlesData = {
    'getting-started': [
      { id: 'gs-1', title: 'How to create an account', views: 12453 },
      { id: 'gs-2', title: 'Setting up your first portfolio', views: 8721 },
      { id: 'gs-3', title: 'Understanding the dashboard', views: 7654 },
      { id: 'gs-4', title: 'Navigating the platform', views: 6543 },
      { id: 'gs-5', title: 'Adding your first investment', views: 5432 },
    ],
    'account': [
      { id: 'acc-1', title: 'Updating your profile information', views: 4321 },
      { id: 'acc-2', title: 'Changing your password', views: 3987 },
      { id: 'acc-3', title: 'Two-factor authentication setup', views: 3654 },
      { id: 'acc-4', title: 'Managing notification preferences', views: 2987 },
      { id: 'acc-5', title: 'Deleting your account', views: 2543 },
    ],
    'portfolio': [
      { id: 'port-1', title: 'Creating multiple portfolios', views: 5678 },
      { id: 'port-2', title: 'Importing transactions', views: 4567 },
      { id: 'port-3', title: 'Setting investment goals', views: 3456 },
      { id: 'port-4', title: 'Portfolio rebalancing', views: 3210 },
      { id: 'port-5', title: 'Understanding performance metrics', views: 2987 },
    ],
    'market-data': [
      { id: 'md-1', title: 'Reading stock charts', views: 7890 },
      { id: 'md-2', title: 'Understanding market indicators', views: 6789 },
      { id: 'md-3', title: 'Cryptocurrency market data', views: 5678 },
      { id: 'md-4', title: 'Setting price alerts', views: 4567 },
      { id: 'md-5', title: 'Historical data analysis', views: 3456 },
    ],
    'security': [
      { id: 'sec-1', title: 'Securing your account', views: 8765 },
      { id: 'sec-2', title: 'Recognizing phishing attempts', views: 7654 },
      { id: 'sec-3', title: 'Data privacy practices', views: 6543 },
      { id: 'sec-4', title: 'Device management', views: 5432 },
      { id: 'sec-5', title: 'Understanding our security measures', views: 4321 },
    ],
    'billing': [
      { id: 'bill-1', title: 'Subscription plans comparison', views: 5432 },
      { id: 'bill-2', title: 'Managing payment methods', views: 4321 },
      { id: 'bill-3', title: 'Billing cycle and invoices', views: 3210 },
      { id: 'bill-4', title: 'Cancelling your subscription', views: 2987 },
      { id: 'bill-5', title: 'Requesting a refund', views: 2345 },
    ],
  };
  
  // Popular articles across all categories
  const popularArticles = [
    { id: 'gs-1', title: 'How to create an account', category: 'Getting Started', views: 12453 },
    { id: 'sec-1', title: 'Securing your account', category: 'Security', views: 8765 },
    { id: 'md-1', title: 'Reading stock charts', category: 'Market Data', views: 7890 },
    { id: 'port-1', title: 'Creating multiple portfolios', category: 'Portfolio Management', views: 5678 },
    { id: 'bill-1', title: 'Subscription plans comparison', category: 'Billing & Subscription', views: 5432 },
  ];
  
  // Filter articles based on search query
  const filteredArticles = searchQuery.trim() === '' 
    ? helpArticles[activeCategory] 
    : Object.values(helpArticles)
        .flat()
        .filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-10 pr-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-lg"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Help Categories</h2>
              <nav className="space-y-2">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeCategory === category.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <span className="mr-3">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Need More Help?</h2>
                <div className="space-y-4">
                  <Link href="/contact" className="block text-blue-600 hover:text-blue-800 font-medium">
                    Contact Support
                  </Link>
                  <Link href="/faq" className="block text-blue-600 hover:text-blue-800 font-medium">
                    Frequently Asked Questions
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Articles Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {searchQuery.trim() === '' 
                  ? helpCategories.find(cat => cat.id === activeCategory)?.name 
                  : `Search Results for "${searchQuery}"`}
              </h2>
              
              {filteredArticles.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredArticles.map((article: HelpArticle) => (
                    <li key={article.id} className="py-4">
                      <a href="#" className="block hover:bg-gray-50 -m-4 p-4 rounded-md transition duration-150">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-blue-600">{article.title}</p>
                          <span className="text-sm text-gray-500">{article.views.toLocaleString()} views</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">We couldn't find any articles matching your search. Please try a different query.</p>
                </div>
              )}
            </div>
            
            {/* Popular Articles Section (only shown when not searching) */}
            {searchQuery.trim() === '' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Articles</h2>
                <ul className="divide-y divide-gray-200">
                  {popularArticles.map((article) => (
                    <li key={article.id} className="py-4">
                      <a href="#" className="block hover:bg-gray-50 -m-4 p-4 rounded-md transition duration-150">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-medium text-blue-600">{article.title}</p>
                            <p className="mt-1 text-sm text-gray-500">{article.category}</p>
                          </div>
                          <span className="text-sm text-gray-500">{article.views.toLocaleString()} views</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}