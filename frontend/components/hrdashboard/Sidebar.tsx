import { useRouter } from 'next/navigation';
import { CalendarPlus, Users, FileSpreadsheet } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface SidebarProps {
  items: SidebarItem[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeTab, setActiveTab }) => {
  const router = useRouter();

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (id === 'create-interview') {
      router.push('/hrdash/create-interview');
    } else if (id === 'view-interview-details') {
      router.push('/hrdash/view-interview-details');
    }
    // Add more navigation logic for other tabs if needed
  };

  return (
    <div className="w-64 bg-gray-900 text-gray-100">
      <div className="p-4 text-xl font-semibold border-b border-gray-700">HR Dashboard</div>
      <ul className="mt-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={`p-4 cursor-pointer flex items-center space-x-2 hover:bg-gray-700 transition-colors duration-200 ${
              activeTab === item.id ? 'bg-gray-700' : ''
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;