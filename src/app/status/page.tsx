'use client';

import { useState, useEffect } from 'react';

// Define types for our system status data
type ServiceStatus = 'operational' | 'degraded' | 'outage';

type Service = {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: string;
  lastIncident: string;
};

type IncidentUpdate = {
  time: string;
  message: string;
};

type Incident = {
  id: string;
  date: string;
  title: string;
  status: 'resolved' | 'ongoing';
  services: string[];
  updates: IncidentUpdate[];
};

type StatusSummary = {
  status: string;
  color: string;
};

export default function SystemStatus() {
  // Mock data for system status
  const [services, setServices] = useState<Service[]>([
    { id: 'web-app', name: 'Web Application', status: 'operational', uptime: '99.98%', lastIncident: '15 days ago' },
    { id: 'api', name: 'API Services', status: 'operational', uptime: '99.95%', lastIncident: '3 days ago' },
    { id: 'market-data', name: 'Market Data Feed', status: 'operational', uptime: '99.92%', lastIncident: '7 days ago' },
    { id: 'auth', name: 'Authentication', status: 'operational', uptime: '99.99%', lastIncident: '32 days ago' },
    { id: 'portfolio', name: 'Portfolio Services', status: 'operational', uptime: '99.97%', lastIncident: '12 days ago' },
    { id: 'notifications', name: 'Notifications', status: 'operational', uptime: '99.90%', lastIncident: '5 days ago' },
    { id: 'payments', name: 'Payment Processing', status: 'operational', uptime: '99.95%', lastIncident: '18 days ago' },
    { id: 'analytics', name: 'Analytics Engine', status: 'operational', uptime: '99.93%', lastIncident: '9 days ago' },
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 'inc-001',
      date: 'May 15, 2023',
      title: 'Market Data Delay',
      status: 'resolved',
      services: ['Market Data Feed'],
      updates: [
        { time: '10:15 AM', message: 'We are investigating delays in market data updates.' },
        { time: '11:30 AM', message: 'The issue has been identified as a connection problem with one of our data providers.' },
        { time: '12:45 PM', message: 'The connection has been restored and market data is now updating normally.' },
      ]
    },
    {
      id: 'inc-002',
      date: 'May 10, 2023',
      title: 'Authentication Service Degradation',
      status: 'resolved',
      services: ['Authentication'],
      updates: [
        { time: '3:20 PM', message: 'Some users are experiencing slow login times.' },
        { time: '4:05 PM', message: 'We have identified the cause as high traffic volume and are scaling up our authentication servers.' },
        { time: '4:30 PM', message: 'The authentication service has been scaled up and is now operating normally.' },
      ]
    },
    {
      id: 'inc-003',
      date: 'May 3, 2023',
      title: 'API Rate Limiting Issues',
      status: 'resolved',
      services: ['API Services'],
      updates: [
        { time: '9:10 AM', message: 'Some API requests are being incorrectly rate limited.' },
        { time: '10:25 AM', message: 'We have identified a configuration issue in our rate limiting service.' },
        { time: '11:15 AM', message: 'The configuration has been updated and API rate limiting is now functioning correctly.' },
      ]
    },
  ]);

  // Simulate occasional status changes for demo purposes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly select a service to update (for demonstration purposes)
      const randomIndex = Math.floor(Math.random() * services.length);
      const randomService = {...services[randomIndex]};
      
      // 10% chance of a service having an issue
      const hasIssue = Math.random() < 0.1;
      
      if (hasIssue) {
        // Randomly assign a degraded or outage status
        randomService.status = Math.random() < 0.7 ? 'degraded' : 'outage';
        
        // Update the services array
        const updatedServices = [...services];
        updatedServices[randomIndex] = randomService;
        setServices(updatedServices);
        
        // Automatically resolve after a few seconds (for demo purposes)
        setTimeout(() => {
          const resolvedServices = [...updatedServices];
          resolvedServices[randomIndex].status = 'operational';
          setServices(resolvedServices);
        }, 5000);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [services]);

  // Get status summary
  const getStatusSummary = (): StatusSummary => {
    const hasOutage = services.some(service => service.status === 'outage');
    const hasDegradation = services.some(service => service.status === 'degraded');
    
    if (hasOutage) return { status: 'major outage', color: 'bg-red-500' };
    if (hasDegradation) return { status: 'service degradation', color: 'bg-yellow-500' };
    return { status: 'all systems operational', color: 'bg-emerald-500' };
  };

  const statusSummary = getStatusSummary();

  // Get status badge color
  const getStatusBadgeColor = (status: ServiceStatus): string => {
    switch (status) {
      case 'operational': return 'bg-emerald-100 text-emerald-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'outage': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format status text
  const formatStatusText = (status: ServiceStatus): string => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'degraded': return 'Degraded';
      case 'outage': return 'Outage';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-navy-950 mb-4">System Status</h1>
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusSummary.color} text-white text-sm font-medium uppercase tracking-wide`}>
            {statusSummary.status}
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Current status of MyBitFinance services and recent incidents
          </p>
        </div>
        
        {/* Current Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-navy-900">Current Service Status</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {services.map((service) => (
              <div key={service.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-navy-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">Uptime: {service.uptime} • Last incident: {service.lastIncident}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(service.status)}`}>
                    {formatStatusText(service.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Incidents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-navy-900">Recent Incidents</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {incidents.length > 0 ? (
              incidents.map((incident) => (
                <div key={incident.id} className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-navy-900">{incident.title}</h3>
                      <p className="text-sm text-gray-500">
                        {incident.date} • Affected: {incident.services.join(', ')}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${incident.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {incident.status === 'resolved' ? 'Resolved' : 'Ongoing'}
                    </span>
                  </div>
                  <div className="border-l-2 border-gray-200 pl-4 ml-2">
                    {incident.updates.map((update, index) => (
                      <div key={index} className="mb-3 last:mb-0">
                        <p className="text-sm font-medium text-navy-900">{update.time}</p>
                        <p className="text-sm text-gray-600">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">No incidents reported in the last 90 days.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Subscription */}
        <div className="mt-12 bg-navy-50 rounded-xl shadow-sm border border-navy-100 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-medium text-navy-800">Stay Updated</h3>
                <p className="mt-2 text-sm text-navy-600">
                  Subscribe to receive notifications about system status changes and incidents.
                </p>
              </div>
              <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:text-sm transition-colors duration-200"
                >
                  Subscribe to Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}