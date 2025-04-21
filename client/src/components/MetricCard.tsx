
import React from 'react';
import { cn } from '@/lib/utils';
import LineChart from './LineChart';
import { VitalSign } from '@/data/types';
import { getStatusColor, getStatusText } from '@/data/dataGenerators';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  subtitle?: string;
  color: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
  chartData?: VitalSign[];
  chartColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  subtitle,
  color,
  icon,
  trend,
  status = 'normal',
  chartData,
  chartColor,
}) => {
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);

  const renderTrendIcon = () => {
    if (trend === 'up') {
      return <span className="text-green-500">↑</span>;
    } else if (trend === 'down') {
      return <span className="text-red-500">↓</span>;
    }
    return <span className="text-gray-500 dark:text-gray-400">→</span>;
  };

  return (
    <div 
      className={cn(
        "metric-card animate-fade-in bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700",
        status === 'critical' && 'animate-pulse-effect'
      )}
      style={{ 
        borderTop: `4px solid ${color}`,
        boxShadow: status === 'critical' ? `0 0 15px rgba(244, 67, 54, 0.3)` : ''
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="metric-title text-gray-700 dark:text-gray-200">{title}</h3>
          <div className="flex items-baseline">
            <span className="metric-value" style={{ color }}>
              {value}
              <span className="text-lg ml-1">{unit}</span>
            </span>
            {trend && <span className="ml-2">{renderTrendIcon()}</span>}
          </div>
          {subtitle && <p className="metric-subtitle text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        {icon && <div className="text-gray-400 dark:text-gray-500 rounded-full p-2">{icon}</div>}
      </div>

      <div className="flex items-center mt-2 mb-4">
        <span className={`status-indicator ${statusColor}`}></span>
        <span className="status-text text-gray-600 dark:text-gray-300">{statusText}</span>
      </div>
      
      {chartData && chartData.length > 0 && (
        <div className="chart-container">
          <LineChart 
            data={chartData} 
            color={chartColor || color} 
            unit={unit} 
            name={title}
            height={120}
            showGrid={false}
            showAxis={true}
            showTooltip={true}
          />
        </div>
      )}
    </div>
  );
};

export default MetricCard;
