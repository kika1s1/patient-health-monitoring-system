
import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 py-4 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 Health Monitoring System</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: 13 May 2025, 10:45 AM</p>
      </div>
    </footer>
  );
};

export default DashboardFooter;
