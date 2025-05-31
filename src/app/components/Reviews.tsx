'use client';

import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

const reviews = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Professional Investor',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Sarah',
    rating: 5,
    review: 'MyBitFinance has transformed how I manage my investment portfolio. The real-time analytics and market insights are invaluable for making informed decisions.',
    verifiedPurchase: true
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Day Trader',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=James',
    rating: 5,
    review: 'The platform\'s user interface is incredibly intuitive, and the market data accuracy is exceptional. It\'s become my go-to tool for daily trading.',
    verifiedPurchase: true
  },
  {
    id: 3,
    name: 'Emma Thompson',
    role: 'Crypto Enthusiast',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Emma',
    rating: 4,
    review: 'The crypto tracking features are outstanding. I particularly appreciate the detailed analytics and portfolio management tools.',
    verifiedPurchase: true
  },
  {
    id: 4,
    name: 'Michael Rodriguez',
    role: 'Financial Advisor',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Michael',
    rating: 5,
    review: 'I recommend MyBitFinance to all my clients. The security features and comprehensive market analysis tools make it a standout platform.',
    verifiedPurchase: true
  }
];

export default function Reviews() {
  return (
    <section className="py-20 bg-gradient-to-b from-navy-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-navy-900 to-emerald-600">
            Trusted by Thousands of Investors
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join our community of successful investors who have transformed their
            financial future with MyBitFinance
          </p>
          
          {/* Trustpilot Overall Rating */}
          <div className="mt-8 inline-flex items-center bg-white/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-500/20 hover:border-emerald-500/40 group">
            <div className="flex items-center space-x-1 text-[#00B67A] transform group-hover:scale-110 transition-transform duration-300">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-5 h-5 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
            <span className="ml-3 font-semibold text-navy-900">4.8 out of 5</span>
            <span className="ml-2 text-gray-500">on</span>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMjAiPjxwYXRoIGZpbGw9IiMwMEI2N0EiIGQ9Ik0xNiAwbDQgMTJMMjggMGgxNnY0SDMydjRoMTB2NEgzMnY4SDE2ek00OCAwaDEydjE2SDQ4ek02NCAwaDEydjRINjh2MTJINjR6TTgwIDBoMTZ2NGgtNHYxMmgtOFY0aC00ek0xMDAgMGgxNnY0aC00djEyaC04VjRoLTR6Ii8+PC9zdmc+"
              alt="Trustpilot"
              className="h-5 ml-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              alt="Trustpilot"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-500/20 hover:border-emerald-500/40 transform hover:-translate-y-2 group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={56}
                    height={56}
                    className="rounded-full relative transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-navy-900 group-hover:text-emerald-600 transition-colors duration-300">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4 text-[#00B67A]" />
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4 text-gray-200" />
                ))}
              </div>
              
              <p className="text-gray-600 mb-4">{review.review}</p>
              
              {review.verifiedPurchase && (
                <div className="flex items-center text-sm text-emerald-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified User
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}