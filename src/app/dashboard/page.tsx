'use client';

import { useUser } from '@clerk/nextjs';
import PortfolioOverview from '@/app/components/dashboard/PortfolioOverview';
import Watchlist from '@/app/components/dashboard/Watchlist';
import MarketOverview from '@/app/components/dashboard/MarketOverview';
import RecentActivity from '@/app/components/dashboard/RecentActivity';
import QuickActions from '@/app/components/dashboard/QuickActions';
import CollapsibleCard from '@/app/components/CollapsibleCard';
import ProgressIndicator from '@/app/components/ProgressIndicator';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Investor'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your investments today.
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <PortfolioOverview />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <CollapsibleCard title="Live Market Data" initialOpen liveData="Updated 5s ago">
                <p className="text-gray-300">Real-time market data and insights at your fingertips.</p>
                <div className="mt-4">
                  <ProgressIndicator progress={75} label="Market Sentiment" />
                </div>
              </CollapsibleCard>
              <CollapsibleCard title="Your Investment Progress" liveData="+$1,234.56">
                <p className="text-gray-300">Track your investment growth and performance metrics.</p>
                <div className="mt-4">
                  <ProgressIndicator progress={90} label="Portfolio Growth" />
                </div>
              </CollapsibleCard>
            </div>
            <MarketOverview />
            <RecentActivity />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <QuickActions />
            <Watchlist />
          </div>
        </div>
      </div>
    </div>
  );
}