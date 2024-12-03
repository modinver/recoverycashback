import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Settings,
  Clock,
} from 'lucide-react';

const AdminSidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: FileText, label: 'News', path: '/admin/news' },
    { icon: Clock, label: 'Prayer Times', path: '/admin/prayer-times' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;