import React from 'react';

export default function Compliance() {
  // Compliance frameworks
  const complianceFrameworks = [
    {
      title: 'Anti-Money Laundering (AML)',
      description: 'Our robust AML program includes customer verification, transaction monitoring, and suspicious activity reporting in compliance with global AML regulations.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Know Your Customer (KYC)',
      description: 'Our KYC procedures verify customer identities through document verification, biometric checks, and ongoing monitoring to prevent fraud and ensure regulatory compliance.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
    {
      title: 'Data Protection & Privacy',
      description: 'We comply with GDPR, CCPA, and other global data protection regulations to ensure proper handling, storage, and processing of personal data.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
    },
    {
      title: 'Financial Reporting',
      description: 'We maintain accurate financial records and reporting in compliance with applicable accounting standards and regulatory requirements.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  // Regulatory bodies
  const regulatoryBodies = [
    {
      name: 'Financial Conduct Authority (FCA)',
      description: 'Registered with the UK\'s FCA for financial services activities.',
      logo: '/regulatory/fca.svg', // Placeholder path
    },
    {
      name: 'Securities and Exchange Commission (SEC)',
      description: 'Compliant with SEC regulations for securities trading and investment advice.',
      logo: '/regulatory/sec.svg', // Placeholder path
    },
    {
      name: 'Financial Industry Regulatory Authority (FINRA)',
      description: 'Member of FINRA, adhering to broker-dealer regulations and investor protection standards.',
      logo: '/regulatory/finra.svg', // Placeholder path
    },
    {
      name: 'European Securities and Markets Authority (ESMA)',
      description: 'Compliant with ESMA guidelines for financial services in the European Union.',
      logo: '/regulatory/esma.svg', // Placeholder path
    },
  ];

  // Compliance documents
  const complianceDocuments = [
    {
      title: 'AML Policy',
      description: 'Our Anti-Money Laundering policy detailing our approach to preventing financial crimes.',
      link: '/documents/aml-policy.pdf',
    },
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information.',
      link: '/privacy',
    },
    {
      title: 'Terms of Service',
      description: 'The legal agreement between MyBitFinance and our users.',
      link: '/terms',
    },
    {
      title: 'Cookie Policy',
      description: 'How we use cookies and similar technologies on our platform.',
      link: '/documents/cookie-policy.pdf',
    },
    {
      title: 'Risk Disclosure',
      description: 'Important information about the risks associated with investing and trading.',
      link: '/documents/risk-disclosure.pdf',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Compliance at MyBitFinance</h1>
            <p className="text-xl text-blue-200 mb-8">
              Our commitment to regulatory compliance and industry best practices ensures a secure and trustworthy platform for all users.
            </p>
            <div className="flex space-x-4">
              <a
                href="#compliance-frameworks"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-900 bg-white hover:bg-blue-50"
              >
                Compliance Frameworks
              </a>
              <a
                href="#regulatory-information"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-800"
              >
                Regulatory Information
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Frameworks */}
      <div id="compliance-frameworks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Compliance Framework</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            We maintain comprehensive compliance programs to meet regulatory requirements and protect our users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {complianceFrameworks.map((framework, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="mb-4">{framework.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{framework.title}</h3>
              <p className="text-gray-600">{framework.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Information */}
      <div id="regulatory-information" className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Regulatory Information</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              MyBitFinance operates in compliance with financial regulations across multiple jurisdictions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {regulatoryBodies.map((body, index) => (
                <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    {/* Placeholder for regulatory body logo */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{body.name}</h3>
                    <p className="text-gray-600">{body.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Licensing Information</h3>
              <div className="prose max-w-none text-gray-600">
                <p>
                  MyBitFinance Ltd. is registered and licensed to operate in the following jurisdictions:
                </p>
                <ul className="mt-4 space-y-2">
                  <li><strong>United Kingdom:</strong> Authorized and regulated by the Financial Conduct Authority (FCA), Registration No. 123456</li>
                  <li><strong>United States:</strong> Registered with the Securities and Exchange Commission (SEC), Registration No. 987654</li>
                  <li><strong>European Union:</strong> Authorized under the Markets in Financial Instruments Directive (MiFID II)</li>
                  <li><strong>Singapore:</strong> Licensed by the Monetary Authority of Singapore (MAS), License No. CMS123456</li>
                </ul>
                <p className="mt-4">
                  Please note that the availability of our services may vary by jurisdiction due to regulatory requirements. Users are responsible for ensuring their use of our platform complies with local laws and regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Documents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Compliance Documents</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Access our policies and important compliance documentation.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {complianceDocuments.map((document, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
                  <p className="text-gray-600">{document.description}</p>
                </div>
                <div>
                  <a
                    href={document.link}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Document
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Program */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Compliance Program</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk-Based Approach</h3>
                  <p className="text-gray-600">
                    We implement a risk-based approach to compliance, focusing resources on areas of highest risk while maintaining comprehensive coverage across all operations.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ongoing Monitoring</h3>
                  <p className="text-gray-600">
                    Our automated systems continuously monitor transactions and user activity for suspicious patterns, with human oversight for complex cases.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Regular Training</h3>
                  <p className="text-gray-600">
                    All employees undergo regular compliance training to ensure awareness of regulatory requirements and internal policies.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Independent Reviews</h3>
                  <p className="text-gray-600">
                    Our compliance program undergoes regular independent reviews to ensure effectiveness and identify areas for improvement.
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance Leadership</h3>
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-full mr-4">
                    {/* Placeholder for compliance officer photo */}
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Jennifer Martinez</h4>
                    <p className="text-blue-600 mb-2">Chief Compliance Officer</p>
                    <p className="text-gray-600 text-sm">
                      With over 15 years of experience in financial compliance, Jennifer leads our global compliance program, ensuring adherence to regulatory requirements across all jurisdictions.
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Compliance</h4>
                  <p className="text-gray-600 mb-4">
                    For compliance-related inquiries or to report concerns, please contact our compliance team:
                  </p>
                  <div className="flex items-center text-blue-600 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:compliance@mybitfinance.com">compliance@mybitfinance.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Compliance FAQ</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Common questions about our compliance policies and procedures.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does MyBitFinance verify user identities?</h3>
              <p className="text-gray-600">
                We use a multi-layered approach to verify user identities in compliance with KYC regulations. This includes document verification (government-issued ID), biometric verification (facial recognition), and address verification. The level of verification required may vary based on account activity and jurisdiction.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What measures does MyBitFinance take to prevent money laundering?</h3>
              <p className="text-gray-600">
                Our AML program includes customer due diligence, transaction monitoring, risk assessment, and suspicious activity reporting. We use advanced algorithms to detect unusual patterns and have a dedicated team that reviews flagged transactions. We also maintain records in accordance with regulatory requirements and cooperate with law enforcement when necessary.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does MyBitFinance handle tax reporting?</h3>
              <p className="text-gray-600">
                We provide annual tax statements for users in applicable jurisdictions. In the United States, we issue 1099 forms as required by the IRS. Users are responsible for reporting their investment activities to tax authorities in accordance with local laws. We recommend consulting with a tax professional for guidance on your specific situation.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is MyBitFinance compliant with international sanctions?</h3>
              <p className="text-gray-600">
                Yes, we maintain a robust sanctions compliance program. We screen users against global sanctions lists and restrict access from sanctioned countries. Our systems are regularly updated to reflect changes in international sanctions regimes, and we conduct ongoing monitoring to ensure continued compliance.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How does MyBitFinance protect user data in compliance with privacy regulations?</h3>
              <p className="text-gray-600">
                We implement technical and organizational measures to protect user data in compliance with GDPR, CCPA, and other privacy regulations. This includes data minimization, purpose limitation, access controls, encryption, and regular security assessments. Users can exercise their data rights through their account settings or by contacting our privacy team at privacy@mybitfinance.com.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Committed to Compliance Excellence</h2>
            <p className="max-w-3xl mx-auto text-xl text-blue-200 mb-8">
              Experience a platform that prioritizes regulatory compliance and ethical business practices.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="/sign-up"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-900 bg-white hover:bg-blue-50"
              >
                Open Compliant Account
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-800"
              >
                Contact Compliance Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}