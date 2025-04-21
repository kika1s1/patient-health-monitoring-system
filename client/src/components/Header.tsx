
import React, { useState } from 'react';
import { Layout, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import NotificationPanel from './notifications/NotificationPanel';
import UserProfile from './profiles/UserProfile';
import { useNotifications } from '../contexts/NotificationContext';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "PHMS" }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  
  const currentUser = {
    id: "current-user",
    name: "Dr. Tamirat Kebede",
    email: "tamirat.kebede@codoctor.com",
    role: "Cardiologist",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    department: "Cardiology",
    specialty: "Interventional Cardiology"
  };

  const handleLogout = () => {
    console.log("User logged out");
    // In a real app, this would handle token removal, etc.
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-3">
          <Layout className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {/* Notifications */}
        <NotificationPanel 
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
        
        {/* Messages */}
        <Link to="/messages" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </Link>
        
        {/* User Profile */}
        <div className="flex items-center space-x-2 ml-4">
          <UserProfile user={currentUser} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;
