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

  interface SidebarProps {
    items: SidebarItem[];
    activeTab: string;
    setActiveTab: (id: string) => void;
  }

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (id === 'create-interview') {
      router.push('/hrdash/create-interview');
    }
    else if (id === 'view-interview-details') {
      router.push('/hrdash/view-interview-details');
    }
    
    // Add more navigation logic for other tabs if needed
  };

  return (
    <div className="w-64 bg-gray-800 text-white">
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={`p-4 cursor-pointer ${activeTab === item.id ? 'bg-gray-700' : ''}`}
            onClick={() => handleItemClick(item.id)}
          >
            <item.icon className="inline-block mr-2" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;