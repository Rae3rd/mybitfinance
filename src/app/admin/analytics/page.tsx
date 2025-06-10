'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

// Import Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define types for analytics data
interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: any[];
}

interface GeoData {
  country: string;
  users: number;
  percentage: number;
}

interface DeviceData {
  device: string;
  users: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

interface AcquisitionData {
  source: string;
  users: number;
  percentage: number;
  color: string;
}

export default function AnalyticsDashboard() {
  // State for date range filter
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | '12months'>('30days');
  
  // State for chart data
  const [userChartData, setUserChartData] = useState<ChartData | null>(null);
  const [revenueChartData, setRevenueChartData] = useState<ChartData | null>(null);
  const [transactionChartData, setTransactionChartData] = useState<ChartData | null>(null);
  const [deviceChartData, setDeviceChartData] = useState<ChartData | null>(null);
  
  // State for metrics
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'Total Users',
      value: '24,521',
      change: 12.5,
      changeLabel: 'vs previous period',
      icon: <UserGroupIcon className="h-6 w-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Revenue',
      value: '$1,245,890',
      change: 8.2,
      changeLabel: 'vs previous period',
      icon: <CurrencyDollarIcon className="h-6 w-6" />,
      color: 'bg-emerald-500',
    },
    {
      title: 'Transactions',
      value: '18,472',
      change: -3.1,
      changeLabel: 'vs previous period',
      icon: <ChartBarIcon className="h-6 w-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: 1.8,
      changeLabel: 'vs previous period',
      icon: <ChartPieIcon className="h-6 w-6" />,
      color: 'bg-amber-500',
    },
  ]);
  
  // State for geo data
  const [geoData, setGeoData] = useState<GeoData[]>([
    { country: 'United States', users: 8420, percentage: 34.3 },
    { country: 'United Kingdom', users: 3850, percentage: 15.7 },
    { country: 'Germany', users: 2940, percentage: 12.0 },
    { country: 'Japan', users: 2105, percentage: 8.6 },
    { country: 'Canada', users: 1820, percentage: 7.4 },
    { country: 'Australia', users: 1540, percentage: 6.3 },
    { country: 'France', users: 1280, percentage: 5.2 },
    { country: 'Other', users: 2566, percentage: 10.5 },
  ]);
  
  // State for device data
  const [deviceData, setDeviceData] = useState<DeviceData[]>([
    { 
      device: 'Mobile', 
      users: 14712, 
      percentage: 60, 
      color: 'rgb(59, 130, 246)', 
      icon: <DevicePhoneMobileIcon className="h-5 w-5" /> 
    },
    { 
      device: 'Desktop', 
      users: 7356, 
      percentage: 30, 
      color: 'rgb(16, 185, 129)', 
      icon: <ComputerDesktopIcon className="h-5 w-5" /> 
    },
    { 
      device: 'Tablet', 
      users: 2453, 
      percentage: 10, 
      color: 'rgb(168, 85, 247)', 
      icon: <DevicePhoneMobileIcon className="h-5 w-5" /> 
    },
  ]);
  
  // State for acquisition data
  const [acquisitionData, setAcquisitionData] = useState<AcquisitionData[]>([
    { source: 'Direct', users: 7356, percentage: 30, color: 'rgb(59, 130, 246)' },
    { source: 'Organic Search', users: 6130, percentage: 25, color: 'rgb(16, 185, 129)' },
    { source: 'Referral', users: 4904, percentage: 20, color: 'rgb(168, 85, 247)' },
    { source: 'Social Media', users: 3678, percentage: 15, color: 'rgb(245, 158, 11)' },
    { source: 'Email', users: 2453, percentage: 10, color: 'rgb(239, 68, 68)' },
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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

  // Generate chart data based on date range
  useEffect(() => {
    // Generate labels based on date range
    let labels: string[] = [];
    const currentDate = new Date();
    
    if (dateRange === '7days') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else if (dateRange === '30days') {
      for (let i = 0; i < 30; i += 3) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - (29 - i));
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else if (dateRange === '90days') {
      for (let i = 0; i < 6; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - (90 - i * 15));
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
    } else if (dateRange === '12months') {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
    }

    // Generate random data for user growth chart
    const generateUserData = () => {
      const baseValue = 1000;
      const growth = dateRange === '7days' ? 50 : dateRange === '30days' ? 200 : dateRange === '90days' ? 500 : 1000;
      
      return labels.map((_, index) => {
        return baseValue + growth * index + Math.floor(Math.random() * (growth / 2));
      });
    };

    // Generate random data for revenue chart
    const generateRevenueData = () => {
      const baseValue = 50000;
      const growth = dateRange === '7days' ? 5000 : dateRange === '30days' ? 15000 : dateRange === '90days' ? 40000 : 80000;
      
      return labels.map((_, index) => {
        return baseValue + growth * index + Math.floor(Math.random() * (growth / 2));
      });
    };

    // Generate random data for transactions chart
    const generateTransactionData = () => {
      const deposits = labels.map(() => Math.floor(Math.random() * 500) + 300);
      const withdrawals = labels.map(() => Math.floor(Math.random() * 300) + 100);
      const trades = labels.map(() => Math.floor(Math.random() * 800) + 400);
      
      return { deposits, withdrawals, trades };
    };

    // Set user chart data
    setUserChartData({
      labels,
      datasets: [
        {
          label: 'New Users',
          data: generateUserData(),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    });

    // Set revenue chart data
    setRevenueChartData({
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: generateRevenueData(),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    });

    // Set transaction chart data
    const transactionData = generateTransactionData();
    setTransactionChartData({
      labels,
      datasets: [
        {
          label: 'Deposits',
          data: transactionData.deposits,
          backgroundColor: 'rgb(16, 185, 129)',
        },
        {
          label: 'Withdrawals',
          data: transactionData.withdrawals,
          backgroundColor: 'rgb(239, 68, 68)',
        },
        {
          label: 'Trades',
          data: transactionData.trades,
          backgroundColor: 'rgb(59, 130, 246)',
        },
      ],
    });

    // Set device chart data
    setDeviceChartData({
      labels: deviceData.map(item => item.device),
      datasets: [
        {
          data: deviceData.map(item => item.percentage),
          backgroundColor: deviceData.map(item => item.color),
          borderColor: 'transparent',
          hoverOffset: 4,
        },
      ],
    });
  }, [dateRange]);

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [2],
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          borderDash: [2],
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '70%',
  };

  // Handle export data
  const handleExportData = (format: 'csv' | 'pdf' | 'excel') => {
    // In a real app, this would trigger an API call to generate and download the export
    console.log(`Exporting data in ${format} format`);
    alert(`Exporting analytics data in ${format} format. This would trigger an API call in a real application.`);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <select
              className="text-sm text-gray-700 bg-transparent border-none focus:ring-0 focus:outline-none"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>
          <div className="dropdown relative">
            <button 
              className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => document.getElementById('exportDropdown')?.classList.toggle('hidden')}
            >
              <ArrowDownTrayIcon className="h-5 w-5 text-gray-500" />
              <span>Export</span>
            </button>
            <div id="exportDropdown" className="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleExportData('csv')}
              >
                Export as CSV
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleExportData('excel')}
              >
                Export as Excel
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleExportData('pdf')}
              >
                Export as PDF
              </button>
            </div>
          </div>
          <button className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
            <span>Customize</span>
          </button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {metrics.map((metric, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            variants={itemVariants}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</h3>
              </div>
              <div className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}>
                {React.cloneElement(metric.icon as React.ReactElement<any>, { className: `h-6 w-6 ${metric.color.replace('bg-', 'text-')}` })}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`flex items-center text-sm ${metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {metric.change >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                )}
                {Math.abs(metric.change)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">{metric.changeLabel}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-xs text-gray-500">New Users</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            {userChartData && (
              <Line data={userChartData} options={lineChartOptions} />
            )}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></div>
                <span className="text-xs text-gray-500">Total Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            {revenueChartData && (
              <Line data={revenueChartData} options={lineChartOptions} />
            )}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Types Chart */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Transaction Types</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-emerald-500 mr-1"></div>
                <span className="text-xs text-gray-500">Deposits</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs text-gray-500">Withdrawals</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-xs text-gray-500">Trades</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            {transactionChartData && (
              <Bar data={transactionChartData} options={barChartOptions} />
            )}
          </div>
        </motion.div>

        {/* Device Distribution Chart */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Distribution</h3>
          <div className="h-60 flex justify-center">
            {deviceChartData && (
              <Doughnut data={deviceChartData} options={doughnutChartOptions} />
            )}
          </div>
          <div className="mt-6 space-y-3">
            {deviceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md" style={{ backgroundColor: `${item.color}20` }}>
                    {React.cloneElement(item.icon as React.ReactElement<any>, { className: `h-4 w-4 ${item.color}` })}
                  </div>
                  <span className="ml-2 text-sm text-gray-700">{item.device}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                  <span className="ml-2 text-xs text-gray-500">{item.users.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View Full Report
            </button>
          </div>
          <div className="space-y-4">
            {geoData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-md bg-blue-100">
                    <GlobeAltIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="ml-2 text-sm text-gray-700">{item.country}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.percentage}%</span>
                  <span className="text-xs text-gray-500 w-16 text-right">{item.users.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Acquisition Channels */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Acquisition Channels</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View Full Report
            </button>
          </div>
          <div className="space-y-4">
            {acquisitionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.source}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.percentage}%</span>
                  <span className="text-xs text-gray-500 w-16 text-right">{item.users.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Conversion Funnel</h4>
            <div className="flex items-center space-x-1">
              <div className="h-8 bg-blue-500 rounded-l-md" style={{ width: '30%' }}>
                <div className="h-full flex items-center justify-center text-xs text-white font-medium">Visitors</div>
              </div>
              <div className="h-8 bg-emerald-500" style={{ width: '20%' }}>
                <div className="h-full flex items-center justify-center text-xs text-white font-medium">Signups</div>
              </div>
              <div className="h-8 bg-purple-500" style={{ width: '15%' }}>
                <div className="h-full flex items-center justify-center text-xs text-white font-medium">KYC</div>
              </div>
              <div className="h-8 bg-amber-500 rounded-r-md" style={{ width: '10%' }}>
                <div className="h-full flex items-center justify-center text-xs text-white font-medium">Active</div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>100%</span>
              <span>50%</span>
              <span>30%</span>
              <span>15%</span>
              <span>5%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Click outside handler for dropdowns */}
      <>
      {useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          const exportDropdown = document.getElementById('exportDropdown');
          
          if (exportDropdown && !exportDropdown.contains(event.target as Node) && 
              !((event.target as HTMLElement)?.closest?.('button')?.nextElementSibling?.id?.includes('exportDropdown'))) {
            exportDropdown.classList.add('hidden');
          }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, [])}
      </>
    </div>
  );
}