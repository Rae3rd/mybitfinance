export default function QuickActions() {
  const actions = [
    {
      title: 'Add Investment',
      description: 'Buy stocks or crypto',
      icon: '💰',
      color: 'bg-green-500',
    },
    {
      title: 'View Portfolio',
      description: 'Detailed analysis',
      icon: '📊',
      color: 'bg-blue-500',
    },
    {
      title: 'Market Research',
      description: 'Explore opportunities',
      icon: '🔍',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
              <span className="text-lg">{action.icon}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{action.title}</p>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}