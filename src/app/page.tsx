import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import PriceMarquee from './components/PriceMarquee';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import TransactionPopup from './components/TransactionPopup';
import TradingChart from './components/TradingChart';
import MarketTrendsHeatmap from './components/MarketTrendsHeatmap';
import DynamicPortfolioGraph from './components/DynamicPortfolioGraph';
import CollapsibleCard from './components/CollapsibleCard';
import ProgressIndicator from './components/ProgressIndicator';
import AnimatedCounter from './components/AnimatedCounter';
import NewsSection from './components/NewsSection';

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-950 via-navy-900 to-emerald-950 relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid-flow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900/50 to-navy-950/80"></div>
      </div>
      {/* Transaction Popup */}
      <TransactionPopup />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-600/30 to-emerald-600/30 animate-gradient-x"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-purple-500/20 blur-3xl opacity-50 animate-pulse-slow"></div>
        
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-black via-emerald-400 to-purple-400 animate-text-shimmer">
              Next-Gen Investment Platform
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black opacity-90">
              Powered by AI & Blockchain
            </h2>
            <p className="text-xl md:text-2xl text-black mb-12 max-w-3xl mx-auto">
              Crypto and Stock investments powered by data, secured by technology
            </p>
            
            {!userId ? (
              <div className="space-x-6">
                <Link
                  href="/sign-up"
                  className="bg-emerald-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105 inline-flex items-center"
                >
                  Get Started
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="#plans"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors inline-block"
                >
                  Explore Plans
                </Link>
              </div>
            ) : (
              <div className="space-x-6">
                <Link
                  href="/dashboard"
                  className="bg-emerald-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-600 transition-all transform hover:scale-105"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/portfolio"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  View Portfolio
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Market Ticker */}
        <div className="absolute bottom-0 left-0 right-0 bg-navy-900/80 backdrop-blur-sm border-t border-navy-800">
          <PriceMarquee />
        </div>
      </div>

      {/* Trust & Technology Section */}
      <section className="py-20 bg-white/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-grid animate-grid-flow"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/50"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black via-purple-400 to-cyan-400 animate-text-shimmer mb-4">
              Next-Generation Trading Technology
            </h2>
            <p className="text-lg text-black max-w-3xl mx-auto">
              Powered by advanced AI and blockchain technology, MyBitFinance delivers institutional-grade
              trading capabilities to investors worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {/* USP Cards */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="text-emerald-500 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Real-time Market Data</h3>
              <p className="text-black">Live updates and insights from global markets at your fingertips</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 transform hover:-translate-y-2 group">
              <h3 className="text-xl font-semibold text-black mb-2">Personalized Dashboard</h3>
              <p className="text-black">Customizable analytics and portfolio tracking tools</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-2 group">
              <h3 className="text-xl font-semibold text-black mb-2">Secure Multi-Channel</h3>
              <p className="text-black">Enterprise-grade security for your investments</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 transform hover:-translate-y-2 group">
              <h3 className="text-xl font-semibold text-black mb-2">Regulatory Compliant</h3>
              <p className="text-black">KYC verified and fully compliant operations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Data Visualization Section */}
      <section className="py-20 bg-navy-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6">Advanced Data Visualizations</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Explore market insights and portfolio performance with our interactive tools.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <TradingChart />
            <DynamicPortfolioGraph />
          </div>
          <div className="max-w-4xl mx-auto">
            <MarketTrendsHeatmap />
          </div>
        </div>
      </section>

      {/* Market News Section */}
      <NewsSection />

      {/* Smart UI Components Section */}
      <section className="py-20 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400 mb-6">Smart UI Components</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Experience a seamless and intuitive interface with our intelligent components.</p>
          </div>
          {/* Removed collapsible cards - moved to dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-navy-800/50 backdrop-blur-lg rounded-xl p-6 border border-cyan-500/30 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2">Users</h3>
              <p className="text-4xl font-bold text-cyan-400"><AnimatedCounter from={0} to={15000} duration={2.5} suffix="+" /></p>
            </div>
            <div className="bg-navy-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2">Trades</h3>
              <p className="text-4xl font-bold text-purple-400"><AnimatedCounter from={0} to={500000} duration={2.5} suffix="+" /></p>
            </div>
            <div className="bg-navy-800/50 backdrop-blur-lg rounded-xl p-6 border border-emerald-500/30 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2">Volume</h3>
              <p className="text-4xl font-bold text-emerald-400"><AnimatedCounter from={0} to={100} duration={2.5} prefix="$" suffix="M" decimals={1} /></p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section id="plans" className="py-20 bg-white/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 bg-grid"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/50"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black via-emerald-400 to-cyan-400 mb-6">Investment Plans</h2>
            <p className="text-lg text-black max-w-3xl mx-auto">Choose your path to financial success with our tailored investment strategies</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-black mb-4">Starter</h3>
                <div className="text-4xl font-bold text-emerald-400 mb-6">$50<span className="text-lg text-black font-normal">/min</span></div>
                <ul className="space-y-4 mb-8 text-black">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    Basic Market Analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    5 Trading Pairs
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    Email Support
                  </li>
                </ul>
                <Link href="/sign-up" className="block w-full py-3 px-6 text-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors duration-200">Get Started</Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-cyan-500/50 hover:border-cyan-500/70 transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 opacity-20 group-hover:opacity-30 blur animate-pulse-slow"></div>
              <div className="absolute top-0 right-0 bg-cyan-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">Popular</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-black mb-4">Pro</h3>
                <div className="text-4xl font-bold text-cyan-400 mb-6">$500<span className="text-lg text-black font-normal">/min</span></div>
                <ul className="space-y-4 mb-8 text-black">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-cyan-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    Advanced Technical Analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-cyan-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    20 Trading Pairs
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-cyan-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    24/7 Priority Support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-cyan-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    AI Trading Signals
                  </li>
                </ul>
                <Link href="/sign-up" className="block w-full py-3 px-6 text-center bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 animate-glow">Upgrade to Pro</Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-black mb-4">Enterprise</h3>
                <div className="text-4xl font-bold text-purple-400 mb-6">$1,500<span className="text-lg text-black font-normal">/min</span></div>
                <ul className="space-y-4 mb-8 text-black">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    Institutional Grade Tools
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    Unlimited Trading Pairs
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    Dedicated Account Manager
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    Custom API Integration
                  </li>
                </ul>
                <Link href="/contact" className="block w-full py-3 px-6 text-center bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors duration-200">Contact Sales</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <Reviews />

      {/* Footer */}
      <Footer />
    </main>
  );
}
