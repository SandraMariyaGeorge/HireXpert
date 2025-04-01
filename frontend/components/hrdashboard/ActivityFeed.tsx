import React from 'react';
import { FileText } from 'lucide-react'; // Using FileText icon for interviews

// Define the Interview structure based on your API response
interface Interview {
  _id: string; // Assuming MongoDB _id
  id?: string; // Keep id field if needed elsewhere
  interview_title: string;
  desc: string;
  // Add other fields if needed for display, though not used in this version
}

const ActivityFeed = ({ recentInterviews }: { recentInterviews: Interview[] }) => {
  if (!recentInterviews || recentInterviews.length === 0) {
    return <p className="text-sm text-gray-500">No recent interview activity found.</p>;
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Interview Activity</h2>
      <div className="space-y-4">
        {recentInterviews.map((interview) => (
          <div
            key={interview._id || interview.id}
            className="relative flex items-start space-x-3"
          >
            <div className="relative px-1">
              <div className="h-8 w-8 bg-blue-100 rounded-full ring-4 ring-white flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="min-w-0 flex-1 py-1.5">
              <div className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{interview.interview_title}</span>{' '}
                was created
              </div>
              <p className="text-sm text-gray-600 mt-1 truncate">{interview.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;