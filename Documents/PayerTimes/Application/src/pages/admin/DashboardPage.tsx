import React from 'react';
import { Calendar, Users, FileText, Clock } from 'lucide-react';

const DashboardPage = () => {
  const stats = [
    { icon: Calendar, label: 'Total Events', value: '12' },
    { icon: Users, label: 'Active Users', value: '245' },
    { icon: FileText, label: 'News Articles', value: '18' },
    { icon: Clock, label: 'Prayer Times', value: '5' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <Icon className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        ))}
      </div>

      {/* Add more dashboard content here */}
    </div>
  );
};

export default DashboardPage;