import React from 'react';

const activities = [
  {
    id: 1,
    type: 'interview_scheduled',
    title: 'Interview Scheduled',
    description: 'Technical interview scheduled with John Doe for Senior Developer position',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'assessment_completed',
    title: 'Assessment Completed',
    description: 'Sarah Smith completed the coding assessment for Frontend Developer role',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'candidate_hired',
    title: 'Candidate Hired',
    description: 'Mike Johnson accepted the offer for Product Manager position',
    time: '1 day ago',
  },
  {
    id: 4,
    type: 'feedback_submitted',
    title: 'Interview Feedback',
    description: "New feedback submitted for Emily Brown's UX Designer interview",
    time: '1 day ago',
  },
];

const ActivityFeed = () => {
  return (
    <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="border-l-4 border-gray-900 pl-4 py-2"
          >
            <p className="font-medium text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityFeed;