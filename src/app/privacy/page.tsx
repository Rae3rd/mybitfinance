'use client';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-navy-950 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-emerald-500 mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
            <p className="mb-4">
              At MyBitFinance, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-emerald-500">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Financial information</li>
                <li>Transaction history</li>
                <li>Investment preferences</li>
              </ul>

              <h3 className="text-xl font-medium text-emerald-500">Technical Information</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Usage statistics</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain our services</li>
              <li>To process your transactions</li>
              <li>To send you important updates and notifications</li>
              <li>To improve our platform and user experience</li>
              <li>To comply with legal obligations</li>
              <li>To detect and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational security measures to protect your
              personal information. These measures include encryption, secure servers, and regular
              security assessments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
            <p className="mb-4">
              We may use third-party services to support our platform. These services have their own
              privacy policies and may collect information as specified in their respective privacy
              statements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@mybitfinance.com" className="text-emerald-500 hover:text-emerald-400">
                privacy@mybitfinance.com
              </a>
            </p>
          </section>

          <div className="text-sm text-gray-400 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}