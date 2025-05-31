'use client';

import { useState } from 'react';

// Define types for our FAQ data structure
type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type FAQCategory = {
  id: string;
  name: string;
};

type FAQQuestions = {
  [key: string]: FAQItem[];
};

type OpenQuestionsState = {
  [key: string]: boolean;
};

export default function FAQ() {
  const [openCategory, setOpenCategory] = useState<string>('general');
  const [openQuestions, setOpenQuestions] = useState<OpenQuestionsState>({});
  
  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? '' : categoryId);
  };
  
  const toggleQuestion = (questionId: string) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // FAQ categories and questions
  const faqCategories: FAQCategory[] = [
    { id: 'general', name: 'General Questions' },
    { id: 'account', name: 'Account & Security' },
    { id: 'portfolio', name: 'Portfolio Management' },
    { id: 'market', name: 'Market Data' },
    { id: 'billing', name: 'Billing & Subscription' },
  ];
  
  const faqQuestions: FAQQuestions = {
    'general': [
      {
        id: 'gen-1',
        question: 'What is MyBitFinance?',
        answer: 'MyBitFinance is a comprehensive investment tracking platform that allows you to monitor and analyze your stock and cryptocurrency investments in one place. We provide real-time market data, portfolio tracking, and advanced analytics to help you make informed investment decisions.'
      },
      {
        id: 'gen-2',
        question: 'Is MyBitFinance available on mobile devices?',
        answer: 'Yes, MyBitFinance is fully responsive and works on all devices including smartphones and tablets. We\'re also working on dedicated mobile apps for iOS and Android which will be available soon.'
      },
      {
        id: 'gen-3',
        question: 'How accurate is the market data?',
        answer: 'We source our market data from industry-leading providers and exchanges to ensure high accuracy. Stock data is typically delayed by 15 minutes for free accounts, while premium subscribers get real-time data. Cryptocurrency data is real-time for all users.'
      },
      {
        id: 'gen-4',
        question: 'Can I import my existing portfolio?',
        answer: 'Yes, you can import your portfolio data from CSV files or connect directly with supported brokerages. We support imports from popular platforms like Excel, Google Sheets, Yahoo Finance, and more.'
      },
      {
        id: 'gen-5',
        question: 'How do I get started with MyBitFinance?',
        answer: 'Getting started is easy! Simply create an account, set up your first portfolio, and begin adding your investments. Our intuitive interface will guide you through the process, and you can always refer to our Help Center for detailed instructions.'
      },
    ],
    'account': [
      {
        id: 'acc-1',
        question: 'How do I create an account?',
        answer: 'To create an account, click on the "Sign Up" button in the top right corner of the homepage. You can sign up using your email address, or through Google or Apple authentication for faster access.'
      },
      {
        id: 'acc-2',
        question: 'Is my financial data secure?',
        answer: 'Absolutely. We take security very seriously and employ industry-standard encryption and security practices. Your data is encrypted both in transit and at rest. We never store sensitive information like your brokerage passwords, and we use secure OAuth connections when linking to external services.'
      },
      {
        id: 'acc-3',
        question: 'How can I reset my password?',
        answer: 'If you forgot your password, click on the "Sign In" button, then select "Forgot password?" link. Enter your email address, and we\'ll send you instructions to reset your password securely.'
      },
      {
        id: 'acc-4',
        question: 'Can I enable two-factor authentication?',
        answer: 'Yes, we strongly recommend enabling two-factor authentication (2FA) for additional security. You can set this up in your account settings by going to Security preferences and following the instructions to set up 2FA using an authenticator app or SMS.'
      },
      {
        id: 'acc-5',
        question: 'How do I delete my account?',
        answer: 'If you wish to delete your account, please go to Account Settings, scroll to the bottom, and click on "Delete Account". Please note that this action is irreversible and will permanently delete all your data from our systems.'
      },
    ],
    'portfolio': [
      {
        id: 'port-1',
        question: 'How many portfolios can I create?',
        answer: 'Free users can create up to 3 portfolios, while premium subscribers can create unlimited portfolios. This allows you to separate investments by strategy, account type, or any other organization method you prefer.'
      },
      {
        id: 'port-2',
        question: 'Can I track both stocks and cryptocurrencies in the same portfolio?',
        answer: 'Yes, you can track stocks, ETFs, mutual funds, cryptocurrencies, and other asset types all within the same portfolio. Our platform is designed to give you a holistic view of your investments across different asset classes.'
      },
      {
        id: 'port-3',
        question: 'How do I add transactions to my portfolio?',
        answer: 'To add a transaction, navigate to your portfolio page and click the "Add Transaction" button. From there, you can select the asset, transaction type (buy, sell, dividend, etc.), date, quantity, price, and any fees or commissions.'
      },
      {
        id: 'port-4',
        question: 'Does MyBitFinance support dividend tracking?',
        answer: 'Yes, you can track dividends, interest payments, and other income from your investments. Simply add them as income transactions in your portfolio, and they will be reflected in your performance metrics and income reports.'
      },
      {
        id: 'port-5',
        question: 'Can I set investment goals for my portfolio?',
        answer: 'Yes, you can set and track investment goals for each portfolio. Go to the portfolio settings and select "Goals" to set target values, time horizons, and contribution plans. Our dashboard will show your progress toward these goals.'
      },
    ],
    'market': [
      {
        id: 'market-1',
        question: 'What market data is available?',
        answer: 'We provide comprehensive market data including current prices, historical charts, key statistics, company fundamentals for stocks, and network metrics for cryptocurrencies. Premium users get access to additional data like analyst ratings, detailed financials, and technical indicators.'
      },
      {
        id: 'market-2',
        question: 'Can I set price alerts?',
        answer: 'Yes, you can set custom price alerts for any asset. When the price reaches your specified threshold, you\'ll receive a notification via email or push notification (if you have our mobile app installed).'
      },
      {
        id: 'market-3',
        question: 'How far back does historical data go?',
        answer: 'For most stocks, we provide historical data going back up to 20 years. For cryptocurrencies, historical data typically goes back to when the asset was first traded on major exchanges. Premium users have access to more granular historical data.'
      },
      {
        id: 'market-4',
        question: 'Do you provide technical analysis tools?',
        answer: 'Yes, premium subscribers have access to advanced technical analysis tools including various chart types, technical indicators, drawing tools, and pattern recognition features to help analyze price movements and trends.'
      },
      {
        id: 'market-5',
        question: 'Which exchanges do you source cryptocurrency data from?',
        answer: 'We aggregate cryptocurrency data from multiple major exchanges including Binance, Coinbase, Kraken, and others to provide accurate pricing information. This allows us to calculate volume-weighted average prices for the most accurate valuation of your crypto assets.'
      },
    ],
    'billing': [
      {
        id: 'bill-1',
        question: 'What subscription plans do you offer?',
        answer: 'We offer a free Basic plan with essential features, a Premium plan with advanced analytics and real-time data, and a Professional plan for serious investors with institutional-grade tools. You can compare all features on our Pricing page.'
      },
      {
        id: 'bill-2',
        question: 'How do I upgrade my subscription?',
        answer: 'To upgrade your subscription, go to Account Settings and select "Subscription". From there, you can view available plans and complete the upgrade process. Your new features will be activated immediately after payment.'
      },
      {
        id: 'bill-3',
        question: 'Do you offer annual billing?',
        answer: 'Yes, we offer both monthly and annual billing options. Annual subscriptions come with a 20% discount compared to monthly billing, providing significant savings for long-term users.'
      },
      {
        id: 'bill-4',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and select cryptocurrencies including Bitcoin and Ethereum for subscription payments.'
      },
      {
        id: 'bill-5',
        question: 'What is your refund policy?',
        answer: 'We offer a 14-day money-back guarantee for new subscriptions. If you\'re not satisfied with our premium features, contact our support team within 14 days of your purchase for a full refund. Please note that refunds are not available for partial subscription periods or after the 14-day window.'
      },
    ],
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-navy-950 mb-4">Frequently Asked Questions</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Find answers to common questions about MyBitFinance and our services.
          </p>
        </div>
        
        {/* FAQ Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${openCategory === category.id ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* FAQ Accordion */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {faqQuestions[openCategory]?.map((faq: FAQItem) => (
              <div key={faq.id} className="px-4 py-5 sm:p-6">
                <dt className="text-lg">
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className="text-left w-full flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-medium text-navy-900">{faq.question}</span>
                    <span className="ml-6 h-7 flex items-center">
                      <svg
                        className={`${openQuestions[faq.id] ? '-rotate-180' : 'rotate-0'} h-6 w-6 transform text-emerald-500`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                </dt>
                <dd className={`mt-2 ${openQuestions[faq.id] ? 'block' : 'hidden'}`}>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </dd>
              </div>
            ))}
          </div>
        </div>
        
        {/* Still Have Questions */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-navy-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer you were looking for, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="inline-flex items-center justify-center px-5 py-3 border border-navy-200 text-base font-medium rounded-md text-navy-700 bg-white hover:bg-gray-50"
            >
              Browse Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}