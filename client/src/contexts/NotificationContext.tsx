
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../components/notifications/NotificationPanel';

// Sample notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'New message from Dr. Sarah',
    description: 'Hello! I just reviewed your latest test results and everything looks good. Let me know if you have any questions.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    type: 'message',
    sender: {
      id: 'doc-1',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    }
  },
  {
    id: '2',
    title: 'Critical patient alert',
    description: 'Patient John Doe in Room 302 has abnormal vital signs. Requires immediate attention.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    read: false,
    type: 'alert',
  },
  {
    id: '3',
    title: 'System update completed',
    description: 'The system has been updated to version 2.3.0. View the changelog for details on new features.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
    type: 'update',
  },
  {
    id: '4',
    title: 'Appointment reminder',
    description: 'You have a video consultation with Dr. Michael Lee tomorrow at 10:00 AM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    type: 'appointment',
  },
  {
    id: '5',
    title: 'New message from Emma',
    description: 'When is my next appointment scheduled for? I need to confirm if I can make it.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    read: false,
    type: 'message',
    sender: {
      id: 'pat-1',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    }
  }
];

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};
