'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Types for transaction data
interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'investment';
  country: string;
  timestamp: Date;
  avatar: string;
}

// Generate random transaction data
const generateRandomTransaction = (): Transaction => {
  const names = [
    'Michael Johnson', 'Emma Williams', 'James Brown', 'Olivia Jones', 'Robert Davis',
    'Sophia Miller', 'William Wilson', 'Ava Moore', 'David Taylor', 'Isabella Anderson',
    'Joseph Thomas', 'Mia Jackson', 'Charles White', 'Charlotte Harris', 'Daniel Martin',
    'Elizabeth Thompson', 'Matthew Garcia', 'Amelia Martinez', 'Andrew Robinson', 'Abigail Clark', 
    'Feliz Gonzalez', 'Ahmed Mohd', 'Esther Idago', 'Regina Garcia', 'Mariana Rodriguez', 'Camila Ortiz'
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Japan', 'Singapore', 'Switzerland', 'Netherlands', 'Mexico'
  ];

  const types: ('deposit' | 'withdrawal' | 'investment')[] = ['deposit', 'withdrawal', 'investment'];
  
  // Generate random amount between $1,500 and $25,000
  const amount = Math.floor(Math.random() * 23500) + 1500;
  
  // AI-generated profile images
  const aiAvatars = [
    'https://api.dicebear.com/7.x/personas/svg?seed=John',
    'https://api.dicebear.com/7.x/personas/svg?seed=Emma',
    'https://api.dicebear.com/7.x/personas/svg?seed=Michael',
    'https://api.dicebear.com/7.x/personas/svg?seed=Sophia',
    'https://api.dicebear.com/7.x/personas/svg?seed=James',
    'https://api.dicebear.com/7.x/personas/svg?seed=Olivia',
    'https://api.dicebear.com/7.x/personas/svg?seed=Robert',
    'https://api.dicebear.com/7.x/personas/svg?seed=Ava',
    'https://api.dicebear.com/7.x/personas/svg?seed=William',
    'https://api.dicebear.com/7.x/personas/svg?seed=Isabella',
    'https://api.dicebear.com/7.x/personas/svg?seed=David',
    'https://api.dicebear.com/7.x/personas/svg?seed=Mia',
    'https://api.dicebear.com/7.x/personas/svg?seed=Joseph',
    'https://api.dicebear.com/7.x/personas/svg?seed=Charlotte',
    'https://api.dicebear.com/7.x/personas/svg?seed=Daniel',
    'https://api.dicebear.com/7.x/personas/svg?seed=Elizabeth',
    'https://api.dicebear.com/7.x/personas/svg?seed=Matthew',
    'https://api.dicebear.com/7.x/personas/svg?seed=Amelia',
    'https://api.dicebear.com/7.x/personas/svg?seed=Andrew',
    'https://api.dicebear.com/7.x/personas/svg?seed=Abigail',
    'https://api.dicebear.com/7.x/personas/svg?seed=Feliz',
    'https://api.dicebear.com/7.x/personas/svg?seed=Ahmed',
    'https://api.dicebear.com/7.x/personas/svg?seed=Esther',
    'https://api.dicebear.com/7.x/personas/svg?seed=Regina',
    'https://api.dicebear.com/7.x/personas/svg?seed=Mariana',
    'https://api.dicebear.com/7.x/personas/svg?seed=Camila'
  ];

  // Use name to select a matching avatar or pick a random one
  const name = names[Math.floor(Math.random() * names.length)];
  const nameIndex = names.indexOf(name);
  const avatarUrl = nameIndex !== -1 && nameIndex < aiAvatars.length 
    ? aiAvatars[nameIndex] 
    : aiAvatars[Math.floor(Math.random() * aiAvatars.length)];

  return {
    id: Math.random().toString(36).substring(2, 9),
    name,
    amount,
    type: types[Math.floor(Math.random() * types.length)],
    country: countries[Math.floor(Math.random() * countries.length)],
    timestamp: new Date(),
    avatar: avatarUrl
  };
};

export default function TransactionPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [position, setPosition] = useState({ bottom: -100, opacity: 0 });

  useEffect(() => {
    // Function to show a new transaction popup
    const showTransaction = () => {
      const newTransaction = generateRandomTransaction();
      setTransaction(newTransaction);
      setIsVisible(true);
      
      // Animate in
      setPosition({ bottom: 20, opacity: 1 });
      
      // Animate out after 5 seconds
      setTimeout(() => {
        setPosition({ bottom: -100, opacity: 0 });
        setTimeout(() => setIsVisible(false), 500); // Hide after animation completes
      }, 5000);
    };

    // Show first transaction after 3 seconds
    const initialTimeout = setTimeout(showTransaction, 3000);
    
    // Show new transactions periodically (every 15-30 seconds)
    const interval = setInterval(() => {
      const randomDelay = Math.floor(Math.random() * 15000) + 15000; // 15-30 seconds
      setTimeout(showTransaction, randomDelay);
    }, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible || !transaction) return null;

  return (
    <div 
      className="fixed left-4 z-50 max-w-md bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-500 ease-in-out"
      style={{ 
        bottom: `${position.bottom}px`, 
        opacity: position.opacity,
        transform: `translateY(${position.opacity === 0 ? '20px' : '0'})`,
      }}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Image 
              src={transaction.avatar} 
              alt={transaction.name} 
              width={48} 
              height={48} 
              className="rounded-full"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {transaction.name}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {transaction.country}
            </p>
            <div className="mt-2 flex flex-wrap items-center">
              {transaction.type === 'deposit' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Deposited ${transaction.amount.toLocaleString()}
                </span>
              )}
              {transaction.type === 'withdrawal' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Withdrew ${transaction.amount.toLocaleString()}
                </span>
              )}
              {transaction.type === 'investment' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Invested ${transaction.amount.toLocaleString()}
                </span>
              )}
              <span className="ml-2 text-xs text-gray-500">
                {new Date(transaction.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <button 
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
            onClick={() => {
              setPosition({ bottom: -100, opacity: 0 });
              setTimeout(() => setIsVisible(false), 500);
            }}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}