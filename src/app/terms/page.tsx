'use client';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-navy-950 text-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-emerald-500 mb-8">Terms of Service</h1>
        
        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using MyBitFinance, you agree to be bound by these Terms of Service and
              all applicable laws and regulations. If you do not agree with any of these terms, you
              are prohibited from using or accessing this platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Use License</h2>
            <div className="space-y-4">
              <p>
                Permission is granted to temporarily access MyBitFinance for personal, non-commercial
                use only. This is the grant of a license, not a transfer of title, and under this
                license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Account Terms</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>You must be 18 years or older to use this platform</li>
              <li>You must provide accurate and complete registration information</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>We reserve the right to suspend or terminate accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Financial Services</h2>
            <div className="space-y-4">
              <p>
                MyBitFinance provides financial information and tools for informational purposes only.
                We do not provide financial advice, and you should consult with qualified professionals
                before making investment decisions.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Market data may be delayed or inaccurate</li>
                <li>Past performance does not guarantee future results</li>
                <li>Investment involves risk of loss</li>
                <li>You are responsible for your investment decisions</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer</h2>
            <p className="mb-4">
              The materials on MyBitFinance are provided on an 'as is' basis. We make no warranties,
              expressed or implied, and hereby disclaim and negate all other warranties including,
              without limitation, implied warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Limitations</h2>
            <p className="mb-4">
              In no event shall MyBitFinance or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business interruption)
              arising out of the use or inability to use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of
              the United Kingdom, and you irrevocably submit to the exclusive jurisdiction of the courts
              in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any
              material changes by posting the new Terms of Service on this page and updating the
              effective date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
            <p className="mb-4">
              Questions about the Terms of Service should be sent to us at:
              <br />
              <a href="mailto:legal@mybitfinance.com" className="text-emerald-500 hover:text-emerald-400">
                legal@mybitfinance.com
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