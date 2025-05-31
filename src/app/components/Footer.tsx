'use client';

import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaGithub, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white relative z-30 pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h2 className="text-2xl font-bold text-emerald-500">MyBitFinance</h2>
            <p className="text-gray-300 text-sm">
              Empowering investors with real-time market data and advanced portfolio management tools.
            </p>
            <div className="flex space-x-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors duration-200 transform hover:scale-110">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors duration-200 transform hover:scale-110">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors duration-200 transform hover:scale-110">
                <span className="sr-only">GitHub</span>
                <FaGithub className="h-6 w-6" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors duration-200 transform hover:scale-110">
                <span className="sr-only">Discord</span>
                <FaDiscord className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">
                  Platform
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/dashboard" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/portfolio" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link href="/market" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Market Data
                    </Link>
                  </li>
                  <li>
                    <Link href="/analytics" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Analytics
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/help" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/status" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      System Status
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/press" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Press
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-emerald-500 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/privacy" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link href="/compliance" className="text-base text-gray-300 hover:text-emerald-500 transition-colors duration-200 inline-block py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-emerald-500 after:transition-all after:duration-300">
                      Compliance
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-navy-800 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {currentYear} MyBitFinance. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}