import React from 'react';
import { Users, UserCheck, Clock } from 'lucide-react';

const InsightCard = ({ icon: Icon, title, value, change }: {
  icon: typeof Users;
  title: string;
  value: string;
  change: string;
}) => (
  <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-2 text-gray-900">{value}</p>
        <p className="text-sm text-gray-700 mt-2">{change}</p>
      </div>
      <Icon className="w-8 h-8 text-gray-900" />
    </div>
  </div>
);

const HiringInsights = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Hiring Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightCard
          icon={Clock}
          title="Total Interviews"
          value="124"
          change="+12% from last month"
        />
        <InsightCard
          icon={Users}
          title="Active Candidates"
          value="45"
          change="+8% from last month"
        />
        <InsightCard
          icon={UserCheck}
          title="Successful Hires"
          value="78%"
          change="+5% from last month"
        />
      </div>
    </div>
  );
}

export default HiringInsights;