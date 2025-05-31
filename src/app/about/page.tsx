import Image from 'next/image';

export default function About() {
  // Company values
  const values = [
    {
      title: 'Transparency',
      description: 'We believe in complete transparency in everything we do, from our pricing to our data sources.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Security',
      description: 'Your financial data security is our top priority. We employ industry-leading security measures to protect your information.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'We continuously innovate to provide you with cutting-edge tools and insights for your investment journey.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Accessibility',
      description: 'We make financial data and analytics accessible to everyone, regardless of their investment experience.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  // Leadership team
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Chief Executive Officer',
      bio: 'Sarah has over 15 years of experience in fintech and previously led product development at major financial institutions.',
      image: '/team/placeholder-1.svg',
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Michael brings 12 years of experience building scalable financial platforms and previously worked at leading tech companies.',
      image: '/team/placeholder-2.svg',
    },
    {
      name: 'Aisha Patel',
      role: 'Chief Product Officer',
      bio: 'Aisha has a background in UX design and financial analytics, with a passion for creating intuitive investment tools.',
      image: '/team/placeholder-3.svg',
    },
    {
      name: 'David Rodriguez',
      role: 'Chief Financial Officer',
      bio: 'David is a certified financial analyst with experience in both traditional finance and cryptocurrency markets.',
      image: '/team/placeholder-4.svg',
    },
  ];

  // Timeline/milestones
  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'MyBitFinance was founded with a mission to democratize access to financial data and analytics.',
    },
    {
      year: '2019',
      title: 'Seed Funding',
      description: 'Secured $2.5M in seed funding to build our core platform and expand our team.',
    },
    {
      year: '2020',
      title: 'Beta Launch',
      description: 'Launched our beta platform with stock tracking and basic portfolio management features.',
    },
    {
      year: '2021',
      title: 'Cryptocurrency Integration',
      description: 'Added comprehensive cryptocurrency tracking and analytics to our platform.',
    },
    {
      year: '2022',
      title: 'Series A Funding',
      description: 'Raised $12M in Series A funding to accelerate growth and develop advanced analytics features.',
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded our services to international markets and reached 500,000 registered users.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About MyBitFinance</h1>
              <p className="text-xl md:text-2xl text-blue-200 mb-8">
                Empowering investors with powerful tools and insights for the modern financial landscape.
              </p>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                Founded in 2018, MyBitFinance has grown from a simple portfolio tracker to a comprehensive investment platform serving hundreds of thousands of users worldwide.
              </p>
              <div className="flex space-x-4">
                <a
                  href="/careers"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-900 bg-white hover:bg-blue-50"
                >
                  Join Our Team
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-800"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-64 md:h-80">
                {/* Placeholder for illustration */}
                <div className="absolute inset-0 bg-blue-800 rounded-lg opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            To democratize access to financial data and empower individuals to make informed investment decisions through intuitive tools and educational resources.
          </p>
        </div>

        {/* Values */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Meet the experienced team behind MyBitFinance dedicated to building the best investment platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="h-64 bg-gray-200 relative">
                  {/* Placeholder for team member photos */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/careers"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </div>

      {/* Company Timeline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Key milestones in our mission to transform how people manage their investments.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>

          {/* Timeline items */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Year bubble */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold z-10">
                  {milestone.year.slice(2)}
                </div>

                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-16 text-right' : 'pl-16 text-left'}`}>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-sm font-semibold text-blue-600">{milestone.year}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-1 mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>

                {/* Empty space for the other side */}
                <div className="w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <div className="text-blue-200">Registered Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$10B+</div>
              <div className="text-blue-200">Assets Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Team Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-blue-200">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to transform your investment journey?</h2>
              <p className="text-lg text-gray-600 mb-6 md:mb-0">
                Join thousands of investors who are using MyBitFinance to track, analyze, and optimize their portfolios.
              </p>
            </div>
            <div className="md:w-1/3 md:text-right">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
              >
                Get Started for Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}