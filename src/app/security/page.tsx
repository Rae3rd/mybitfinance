import React from 'react';

export default function Security() {
  // Security features
  const securityFeatures = [
    {
      title: 'End-to-End Encryption',
      description: 'All sensitive data is encrypted both in transit and at rest using industry-standard encryption protocols.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account with 2FA using authenticator apps or SMS verification.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Secure API Connections',
      description: 'All third-party integrations use OAuth 2.0 and secure API tokens, never storing your credentials.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Regular Security Audits',
      description: 'Our systems undergo regular penetration testing and security audits by independent security firms.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ];

  // Security certifications
  const certifications = [
    {
      name: 'SOC 2 Type II',
      description: 'Certified compliance with SOC 2 Type II standards for security, availability, and confidentiality.',
      logo: '/certifications/soc2.svg', // Placeholder path
    },
    {
      name: 'ISO 27001',
      description: 'Certified compliance with international standards for information security management systems.',
      logo: '/certifications/iso27001.svg', // Placeholder path
    },
    {
      name: 'GDPR Compliant',
      description: 'Our platform and practices are fully compliant with General Data Protection Regulation requirements.',
      logo: '/certifications/gdpr.svg', // Placeholder path
    },
    {
      name: 'PCI DSS',
      description: 'Compliant with Payment Card Industry Data Security Standards for handling payment information.',
      logo: '/certifications/pcidss.svg', // Placeholder path
    },
  ];

  // Security best practices
  const bestPractices = [
    {
      title: 'Use Strong, Unique Passwords',
      description: 'Create a strong password that is at least 12 characters long with a mix of letters, numbers, and symbols. Use a different password for each of your accounts.',
    },
    {
      title: 'Enable Two-Factor Authentication',
      description: 'Add an extra layer of security to your account by enabling 2FA in your account settings.',
    },
    {
      title: 'Keep Your Devices Secure',
      description: 'Ensure your devices have the latest security updates and use antivirus software. Never access your financial accounts on public or unsecured networks.',
    },
    {
      title: 'Be Wary of Phishing Attempts',
      description: 'MyBitFinance will never ask for your password via email or phone. Always verify the website URL before entering your credentials.',
    },
    {
      title: 'Monitor Your Account Regularly',
      description: 'Regularly check your account activity and enable notifications for all transactions and login attempts.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Security at MyBitFinance</h1>
            <p className="text-xl text-navy-200 mb-8">
              Your security is our top priority. Learn about the measures we take to protect your data and investments.
            </p>
            <div className="flex space-x-4">
              <a
                href="#security-features"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-navy-950 bg-emerald-500 hover:bg-emerald-400"
              >
                Security Features
              </a>
              <a
                href="#best-practices"
                className="inline-flex items-center px-6 py-3 border border-emerald-500 text-base font-medium rounded-md text-emerald-500 hover:bg-navy-800"
              >
                Security Best Practices
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div id="security-features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy-950 mb-4">Enterprise-Grade Security Features</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            We implement multiple layers of security to protect your data and financial information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all duration-300">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-navy-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data Protection */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold text-navy-950 mb-6">How We Protect Your Data</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Data Encryption</h3>
                  <p className="text-gray-600">
                    All sensitive data is encrypted using AES-256 encryption, both in transit and at rest. Your financial information is never stored in plain text.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Secure Infrastructure</h3>
                  <p className="text-gray-600">
                    Our platform is hosted on secure cloud infrastructure with multiple redundancies, firewalls, and intrusion detection systems.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Access Controls</h3>
                  <p className="text-gray-600">
                    We implement strict access controls and follow the principle of least privilege. Only authorized personnel have access to systems containing user data.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-500 hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Continuous Monitoring</h3>
                  <p className="text-gray-600">
                    Our security team continuously monitors our systems for suspicious activities and potential vulnerabilities 24/7/365.
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-navy-900 mb-4">Security Certifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {certifications.map((cert, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 hover:shadow-md transition-all duration-300">
                    <div className="h-12 w-12 mb-4 flex items-center justify-center bg-emerald-100 rounded-full">
                      {/* Placeholder for certification logo */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-navy-900 mb-1">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div id="best-practices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy-950 mb-4">Security Best Practices</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Follow these recommendations to keep your account secure and protect your financial information.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {bestPractices.map((practice, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 text-emerald-600">
                      <span className="text-lg font-semibold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-navy-900">{practice.title}</h3>
                    <p className="mt-2 text-gray-600">{practice.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Reporting */}
      <div className="bg-navy-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
            <div className="md:flex md:items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-4">Report a Security Vulnerability</h2>
                <p className="text-gray-600 mb-4">
                  We take security seriously and value the input of security researchers and our user community. If you believe you've found a security vulnerability in our service, we encourage you to report it to us responsibly.
                </p>
                <p className="text-gray-600">
                  Please email our security team at <a href="mailto:security@mybitfinance.com" className="text-emerald-600 hover:text-emerald-800 font-medium">security@mybitfinance.com</a> with details of the vulnerability. We'll respond as quickly as possible and work with you to understand and address the issue.
                </p>
              </div>
              <div className="md:w-1/3">
                <div className="bg-navy-50 rounded-lg p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-emerald-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-navy-900 mb-2">Bug Bounty Program</h3>
                  <p className="text-gray-600 mb-4">
                    We offer rewards for responsibly disclosed security vulnerabilities based on severity and impact.
                  </p>
                  <a
                    href="/security/bug-bounty"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-navy-950 mb-4">Security FAQ</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Common questions about our security practices and policies.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="p-6 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-navy-900 mb-2">How does MyBitFinance protect my financial data?</h3>
              <p className="text-gray-600">
                We use industry-standard encryption protocols to protect all data both in transit and at rest. We implement multiple security layers including firewalls, intrusion detection systems, and regular security audits. Additionally, we follow strict access control policies to ensure only authorized personnel can access systems containing user data.
              </p>
            </div>
            <div className="p-6 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-navy-900 mb-2">Does MyBitFinance share my data with third parties?</h3>
              <p className="text-gray-600">
                We only share your data with third parties when necessary to provide our services, and only with your explicit consent. We never sell your personal information to advertisers or data brokers. For more details, please refer to our <a href="/privacy" className="text-emerald-600 hover:text-emerald-800">Privacy Policy</a>.
              </p>
            </div>
            <div className="p-6 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-navy-900 mb-2">What should I do if I suspect unauthorized access to my account?</h3>
              <p className="text-gray-600">
                If you suspect unauthorized access, immediately change your password and enable two-factor authentication if you haven't already. Contact our support team at <a href="mailto:support@mybitfinance.com" className="text-emerald-600 hover:text-emerald-800">support@mybitfinance.com</a> or through the <a href="/contact" className="text-emerald-600 hover:text-emerald-800">Contact Us</a> page to report the incident.
              </p>
            </div>
            <div className="p-6 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-navy-900 mb-2">How often does MyBitFinance conduct security audits?</h3>
              <p className="text-gray-600">
                We conduct internal security reviews on a continuous basis and engage independent security firms to perform comprehensive penetration testing and security audits at least quarterly. We also maintain compliance with industry security standards through regular certification audits.
              </p>
            </div>
            <div className="p-6 hover:bg-gray-50 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-navy-900 mb-2">What happens to my data if I close my account?</h3>
              <p className="text-gray-600">
                When you close your account, we follow a secure data deletion process in accordance with our retention policies and applicable regulations. Some information may be retained for legal or regulatory purposes, but personal identifiers are removed. For more information, please refer to our <a href="/privacy" className="text-emerald-600 hover:text-emerald-800">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-navy-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Your Security is Our Priority</h2>
            <p className="max-w-3xl mx-auto text-xl text-navy-200 mb-8">
              Experience peace of mind with MyBitFinance's enterprise-grade security features.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-navy-950 bg-emerald-500 hover:bg-emerald-400"
              >
                Create Secure Account
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-emerald-500 text-base font-medium rounded-md text-emerald-500 hover:bg-navy-800"
              >
                Contact Security Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}