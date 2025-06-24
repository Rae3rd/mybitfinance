'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { ArrowPathIcon, CurrencyDollarIcon, BanknotesIcon, QrCodeIcon, WalletIcon, ClockIcon, ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { CreditCardIcon } from '@heroicons/react/24/solid';

export default function WalletPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('deposit'); // deposit, withdraw, history
  const [depositMethod, setDepositMethod] = useState(''); // crypto, bank
  const [cryptoType, setCryptoType] = useState(''); // btc, eth, usdt
  const [amount, setAmount] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Withdrawal state variables
  const [withdrawMethod, setWithdrawMethod] = useState(''); // crypto, bank
  const [withdrawCryptoType, setWithdrawCryptoType] = useState(''); // btc, eth, usdt
  const [withdrawNetwork, setWithdrawNetwork] = useState(''); // network options for the selected crypto
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Wallet addresses
  const walletAddresses = {
    btc: 'bc1qvwh6kx0y24rkn5t8yy2f5hevjz4xnnd7agma4u',
    eth: '0xf55f65AD545AB372F3bE77629b4C04AfE12d6888',
    usdt: 'TFbvJjoFwJjPM9Z9c3AHHtZBQr8Joa4iac'
  };

  // QR code URLs - these would be generated dynamically in a real app
  const qrCodeUrls = {
    btc: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddresses.btc}`,
    eth: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddresses.eth}`,
    usdt: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddresses.usdt}`
  };

  // Network options for each crypto type
  const networkOptions = {
    btc: ['Bitcoin Network'],
    eth: ['Ethereum Mainnet', 'Arbitrum', 'Optimism'],
    usdt: ['Ethereum (ERC20)', 'Tron (TRC20)', 'Binance Smart Chain (BEP20)']
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };

  const handleWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setWithdrawAmount(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setShowQRCode(false);
        setProofFile(null);
        setCryptoType('');
        setDepositMethod('');
      }, 3000);
    }, 2000);
  };

  const handleBankTransfer = () => {
    // Open Telegram with custom message
    const customMessage = `I wish to deposit the sum of $${amount} to my account. My user ID is ${user?.id}.`;
    const encodedMessage = encodeURIComponent(customMessage);
    const telegramUrl = `https://t.me/mybitfinance?text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
  };

  const handleCryptoWithdrawal = () => {
    // Validate wallet address (basic validation)
    if (!walletAddress.trim()) {
      alert('Please enter a valid wallet address');
      return;
    }

    // Open Telegram with custom message for crypto withdrawal
    const customMessage = `I wish to withdraw the sum of $${withdrawAmount} to my ${withdrawCryptoType.toUpperCase()} wallet. My wallet address is ${walletAddress} on ${withdrawNetwork} network. My user ID is ${user?.id}.`;
    const encodedMessage = encodeURIComponent(customMessage);
    const telegramUrl = `https://t.me/mybitfinance?text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
    
    // Reset form
    setWithdrawCryptoType('');
    setWithdrawMethod('');
    setWithdrawNetwork('');
    setWalletAddress('');
    setWithdrawAmount('');
  };

  const handleBankWithdrawal = () => {
    // Open Telegram with custom message for bank withdrawal
    const customMessage = `I wish to withdraw via transfer, the sum of $${withdrawAmount}. My user ID is ${user?.id}.`;
    const encodedMessage = encodeURIComponent(customMessage);
    const telegramUrl = `https://t.me/mybitfinance?text=${encodedMessage}`;
    window.open(telegramUrl, '_blank');
    
    // Reset form
    setWithdrawMethod('');
    setWithdrawAmount('');
  };

  const renderDepositOptions = () => {
    if (!depositMethod) {
      return (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-navy-800 rounded-xl p-6 border border-navy-700 cursor-pointer hover:border-emerald-500/50 transition-all duration-300"
            onClick={() => setDepositMethod('crypto')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-lg">
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Cryptocurrency</h3>
                <p className="text-gray-400">Deposit using BTC, ETH, or USDT</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-navy-800 rounded-xl p-6 border border-navy-700 cursor-pointer hover:border-emerald-500/50 transition-all duration-300"
            onClick={() => setDepositMethod('bank')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg">
                <BanknotesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Bank Transfer</h3>
                <p className="text-gray-400">Deposit using your local bank</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      );
    }
    
    if (depositMethod === 'crypto') {
      if (!cryptoType) {
        return (
          <motion.div 
            className="space-y-6 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <button 
                onClick={() => setDepositMethod('')}
                className="text-emerald-500 hover:text-emerald-400 flex items-center space-x-1 mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to deposit options</span>
              </button>
              
              <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                <h3 className="text-lg font-semibold text-white mb-4">Select Cryptocurrency</h3>
                
                <div className="space-y-4">
                  <div 
                    className="flex items-center space-x-4 p-4 rounded-lg border border-navy-600 hover:border-emerald-500/50 cursor-pointer transition-all duration-300"
                    onClick={() => setCryptoType('btc')}
                  >
                    <div className="bg-orange-500 rounded-full p-2">
                      <img src="/bitcoin-logo.svg" alt="Bitcoin" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Bitcoin (BTC)</h4>
                      <p className="text-sm text-gray-400">Deposit using Bitcoin network</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-4 rounded-lg border border-navy-600 hover:border-emerald-500/50 cursor-pointer transition-all duration-300"
                    onClick={() => setCryptoType('eth')}
                  >
                    <div className="bg-blue-600 rounded-full p-2">
                      <img src="/ethereum-logo.svg" alt="Ethereum" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Ethereum (ETH)</h4>
                      <p className="text-sm text-gray-400">Deposit using Ethereum network</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-4 rounded-lg border border-navy-600 hover:border-emerald-500/50 cursor-pointer transition-all duration-300"
                    onClick={() => setCryptoType('usdt')}
                  >
                    <div className="bg-green-500 rounded-full p-2">
                      <img src="/tether-logo.svg" alt="Tether" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Tether (USDT TRC20)</h4>
                      <p className="text-sm text-gray-400">Deposit using TRON network</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      } else {
        // Show crypto deposit form with amount input and QR code
        return (
          <motion.div 
            className="space-y-6 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <button 
                onClick={() => setCryptoType('')}
                className="text-emerald-500 hover:text-emerald-400 flex items-center space-x-1 mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to crypto options</span>
              </button>
              
              <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {cryptoType === 'btc' ? 'Bitcoin' : cryptoType === 'eth' ? 'Ethereum' : 'Tether USDT TRC20'} Deposit
                </h3>
                
                {!showQRCode ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (USD)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400">$</span>
                        </div>
                        <input
                          type="text"
                          id="amount"
                          value={amount}
                          onChange={handleAmountChange}
                          className="bg-navy-900 border border-navy-600 text-white rounded-lg block w-full pl-8 pr-12 py-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      {parseFloat(amount) < 10 && amount !== '' && (
                        <p className="text-red-500 text-sm mt-1">Minimum deposit amount is $10</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => parseFloat(amount) >= 10 && setShowQRCode(true)}
                      disabled={parseFloat(amount) < 10 || amount === ''}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {!isSuccess ? (
                      <>
                        <div className="text-center">
                          <p className="text-gray-300 mb-4">Please send {amount} USD worth of {cryptoType === 'btc' ? 'Bitcoin' : cryptoType === 'eth' ? 'Ethereum' : 'USDT'} to the following address:</p>
                          
                          <div className="bg-white p-4 rounded-lg inline-block mb-4">
                            <img 
                              src={qrCodeUrls[cryptoType as keyof typeof qrCodeUrls]} 
                              alt="QR Code" 
                              className="w-48 h-48"
                            />
                          </div>
                          
                          <div className="bg-navy-900 p-3 rounded-lg mb-4">
                            <p className="text-sm text-gray-300 break-all font-mono">{walletAddresses[cryptoType as keyof typeof walletAddresses]}</p>
                          </div>
                          
                          <button
                            onClick={() => navigator.clipboard.writeText(walletAddresses[cryptoType as keyof typeof walletAddresses])}
                            className="text-emerald-500 hover:text-emerald-400 text-sm flex items-center space-x-1 mx-auto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy Address</span>
                          </button>
                        </div>
                        
                        <form onSubmit={handleSubmitProof} className="space-y-4">
                          <div>
                            <label htmlFor="proof" className="block text-sm font-medium text-gray-300 mb-1">Upload Proof of Payment</label>
                            <div className="flex items-center justify-center w-full">
                              <label htmlFor="proof" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-navy-600 rounded-lg cursor-pointer bg-navy-900 hover:border-emerald-500/50 transition-all duration-300">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  {proofFile ? (
                                    <>
                                      <svg className="w-8 h-8 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <p className="text-sm text-gray-300">{proofFile.name}</p>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                      </svg>
                                      <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                                      <p className="text-xs text-gray-500">PNG, JPG, or PDF (max 10MB)</p>
                                    </>
                                  )}
                                </div>
                                <input id="proof" type="file" className="hidden" onChange={handleFileChange} accept="image/png,image/jpeg,application/pdf" />
                              </label>
                            </div>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={!proofFile || isSubmitting}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                          >
                            {isSubmitting ? (
                              <>
                                <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
                                Submitting...
                              </>
                            ) : 'Submit Proof of Payment'}
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-emerald-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                          <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Proof Submitted Successfully!</h3>
                        <p className="text-gray-400">Your deposit is being processed. You will be notified once it's confirmed.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      }
    }
    
    if (depositMethod === 'bank') {
      return (
        <motion.div 
          className="space-y-6 mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <button 
              onClick={() => setDepositMethod('')}
              className="text-emerald-500 hover:text-emerald-400 flex items-center space-x-1 mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to deposit options</span>
            </button>
            
            <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
              <h3 className="text-lg font-semibold text-white mb-4">Bank Transfer</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="bank-amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (USD)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">$</span>
                    </div>
                    <input
                      type="text"
                      id="bank-amount"
                      value={amount}
                      onChange={handleAmountChange}
                      className="bg-navy-900 border border-navy-600 text-white rounded-lg block w-full pl-8 pr-12 py-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {parseFloat(amount) < 10 && amount !== '' && (
                    <p className="text-red-500 text-sm mt-1">Minimum deposit amount is $10</p>
                  )}
                </div>
                
                <div className="bg-navy-900 p-4 rounded-lg border border-navy-700">
                  <p className="text-gray-300 text-sm">You will be redirected to our Telegram support to complete your bank transfer. Our support team will provide you with the necessary bank details.</p>
                </div>
                
                <button
                  onClick={handleBankTransfer}
                  disabled={parseFloat(amount) < 10 || amount === ''}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Continue to Telegram Support</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      );
    }
    
    return null;
  };

  const renderWithdrawOptions = () => {
    if (!withdrawMethod) {
      return (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-navy-800 rounded-xl p-6 border border-navy-700 cursor-pointer hover:border-emerald-500/50 transition-all duration-300"
            onClick={() => setWithdrawMethod('crypto')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-lg">
                <CreditCardIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Cryptocurrency</h3>
                <p className="text-gray-400">Withdraw to your crypto wallet</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-navy-800 rounded-xl p-6 border border-navy-700 cursor-pointer hover:border-emerald-500/50 transition-all duration-300"
            onClick={() => setWithdrawMethod('bank')}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg">
                <BanknotesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Bank Transfer</h3>
                <p className="text-gray-400">Withdraw to your bank account</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      );
    }
    
    if (withdrawMethod === 'crypto') {
      if (!withdrawCryptoType) {
        return (
          <motion.div 
            className="space-y-6 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <button 
                onClick={() => setWithdrawMethod('')}
                className="text-emerald-500 hover:text-emerald-400 flex items-center space-x-1 mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to withdrawal options</span>
              </button>
              
              <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                <h3 className="text-lg font-semibold text-white mb-4">Select Cryptocurrency</h3>
                
                <div className="space-y-4">
                  <div 
                    className="flex items-center space-x-4 p-4 rounded-lg border border-navy-600 hover:border-emerald-500/50 cursor-pointer transition-all duration-300"
                    onClick={() => setWithdrawCryptoType('btc')}
                  >
                    <div className="bg-orange-500 rounded-full p-2">
                      <img src="/bitcoin-logo.svg" alt="Bitcoin" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Bitcoin (BTC)</h4>
                      <p className="text-sm text-gray-400">Withdraw to Bitcoin wallet</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-4 rounded-lg border border-navy-600 hover:border-emerald-500/50 cursor-pointer transition-all duration-300"
                    onClick={() => setWithdrawCryptoType('eth')}
                  >
                    <div className="bg-blue-600 rounded-full p-2">
                      <img src="/ethereum-logo.svg" alt="Ethereum" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Ethereum (ETH)</h4>
                      <p className="text-sm text-gray-400">Withdraw to Ethereum wallet</p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center space-x-4 p-4 rounded-lg border border-navy-600 hover:border-emerald-500/50 cursor-pointer transition-all duration-300"
                    onClick={() => setWithdrawCryptoType('usdt')}
                  >
                    <div className="bg-green-500 rounded-full p-2">
                      <img src="/tether-logo.svg" alt="Tether" className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Tether (USDT)</h4>
                      <p className="text-sm text-gray-400">Withdraw to USDT wallet</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      } else {
        // Show crypto withdrawal form
        return (
          <motion.div 
            className="space-y-6 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <button 
                onClick={() => setWithdrawCryptoType('')}
                className="text-emerald-500 hover:text-emerald-400 flex items-center space-x-1 mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to crypto options</span>
              </button>
              
              <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {withdrawCryptoType === 'btc' ? 'Bitcoin' : withdrawCryptoType === 'eth' ? 'Ethereum' : 'Tether USDT'} Withdrawal
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (USD)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">$</span>
                      </div>
                      <input
                        type="text"
                        id="withdraw-amount"
                        value={withdrawAmount}
                        onChange={handleWithdrawAmountChange}
                        className="bg-navy-900 border border-navy-600 text-white rounded-lg block w-full pl-8 pr-12 py-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {parseFloat(withdrawAmount) < 100 && withdrawAmount !== '' && (
                      <p className="text-red-500 text-sm mt-1">Minimum withdrawal amount is $100</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="network" className="block text-sm font-medium text-gray-300 mb-1">Network</label>
                    <select
                      id="network"
                      value={withdrawNetwork}
                      onChange={(e) => setWithdrawNetwork(e.target.value)}
                      className="bg-navy-900 border border-navy-600 text-white rounded-lg block w-full py-2.5 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    >
                      <option value="" disabled>Select network</option>
                      {networkOptions[withdrawCryptoType as keyof typeof networkOptions]?.map((network, index) => (
                        <option key={index} value={network}>{network}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-300 mb-1">Wallet Address</label>
                    <input
                      type="text"
                      id="wallet-address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="bg-navy-900 border border-navy-600 text-white rounded-lg block w-full py-2.5 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder={`Enter your ${withdrawCryptoType.toUpperCase()} wallet address`}
                      required
                    />
                  </div>
                  
                  <div className="bg-navy-900 p-4 rounded-lg border border-navy-700">
                    <p className="text-amber-400 text-sm flex items-start space-x-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Please double-check your wallet address. Withdrawals sent to incorrect addresses cannot be recovered.</span>
                    </p>
                  </div>
                  
                  <button
                    onClick={handleCryptoWithdrawal}
                    disabled={parseFloat(withdrawAmount) < 100 || withdrawAmount === '' || !withdrawNetwork || !walletAddress.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Telegram Support</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      }
    }
    
    if (withdrawMethod === 'bank') {
      return (
        <motion.div 
          className="space-y-6 mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <button 
              onClick={() => setWithdrawMethod('')}
              className="text-emerald-500 hover:text-emerald-400 flex items-center space-x-1 mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to withdrawal options</span>
            </button>
            
            <div className="bg-navy-800 rounded-xl p-6 border border-navy-700">
              <h3 className="text-lg font-semibold text-white mb-4">Bank Transfer Withdrawal</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="bank-withdraw-amount" className="block text-sm font-medium text-gray-300 mb-1">Amount (USD)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400">$</span>
                    </div>
                    <input
                      type="text"
                      id="bank-withdraw-amount"
                      value={withdrawAmount}
                      onChange={handleWithdrawAmountChange}
                      className="bg-navy-900 border border-navy-600 text-white rounded-lg block w-full pl-8 pr-12 py-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {parseFloat(withdrawAmount) < 100 && withdrawAmount !== '' && (
                    <p className="text-red-500 text-sm mt-1">Minimum withdrawal amount is $100</p>
                  )}
                </div>
                
                <div className="bg-navy-900 p-4 rounded-lg border border-navy-700">
                  <p className="text-gray-300 text-sm">You will be redirected to our Telegram support to complete your bank withdrawal. Our support team will guide you through the process.</p>
                </div>
                
                <button
                  onClick={handleBankWithdrawal}
                  disabled={parseFloat(withdrawAmount) < 100 || withdrawAmount === ''}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Continue to Telegram Support</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Wallet</h2>
              <div className="bg-navy-700 rounded-full px-3 py-1 text-xs font-medium text-emerald-400">Active</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg">
                <WalletIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Available Balance</p>
                <h3 className="text-2xl font-bold text-white">$12,345.67</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-navy-800 rounded-xl border border-navy-700">
            <div className="border-b border-navy-700">
              <div className="flex">
                <button
                  className={`px-6 py-4 text-sm font-medium ${activeTab === 'deposit' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveTab('deposit')}
                >
                  Deposit
                </button>
                <button
                  className={`px-6 py-4 text-sm font-medium ${activeTab === 'withdraw' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveTab('withdraw')}
                >
                  Withdraw
                </button>
                <button
                  className={`px-6 py-4 text-sm font-medium ${activeTab === 'history' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveTab('history')}
                >
                  History
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {activeTab === 'deposit' && renderDepositOptions()}
              
              {activeTab === 'withdraw' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderWithdrawOptions()}
                </motion.div>
              )}
              
              {activeTab === 'history' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center py-8">
                    <div className="bg-navy-700 rounded-full p-3 inline-block mb-4">
                      <ClockIcon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Transaction History</h3>
                    <p className="text-gray-400 max-w-md mx-auto">Your recent transactions will appear here. You don't have any transactions yet.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:w-80">
          <div className="bg-navy-800 rounded-xl p-6 border border-navy-700 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Processing Time</h4>
                <div className="flex items-start space-x-3">
                  <div className="bg-navy-700 p-1.5 rounded-md">
                    <ClockIcon className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Deposits: 1-3 hours</p>
                    <p className="text-sm text-gray-300">Withdrawals: 24-48 hours</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Fees</h4>
                <div className="flex items-start space-x-3">
                  <div className="bg-navy-700 p-1.5 rounded-md">
                    <ReceiptPercentIcon className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Deposits: No fee</p>
                    <p className="text-sm text-gray-300">Withdrawals: 1% fee</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <a 
                  href="https://t.me/mybitfinance_support" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 bg-navy-700 hover:bg-navy-600 text-white rounded-lg py-2.5 px-4 transition-colors duration-300"
                >
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm2.99 14.596l-.637-7.12 5.538-4.066-6.879 2.661-3.103-1.1 9.241-3.42-4.16 13.046z" />
                  </svg>
                  <span>Contact Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}