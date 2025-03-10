import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface SidebarProps {
  items: {
    id: string;
    label: string;
    icon: typeof LucideIcon;
  }[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">HR Portal</h2>
      </div>
      
      <nav className="mt-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left ${
                activeTab === item.id
                  ? 'bg-gray-200 text-gray-900 border-r-4 border-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;