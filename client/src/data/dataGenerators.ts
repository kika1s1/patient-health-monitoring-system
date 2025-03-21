
import { VitalSign } from './types';

// Generate time series data for the last 24 hours with 1 hour intervals
export const generateTimeSeriesData = (
  baseValue: number, 
  variance: number, 
  hoursCount = 24,
  pattern: 'stable' | 'increasing' | 'decreasing' | 'fluctuating' = 'stable'
): VitalSign[] => {
  const data: VitalSign[] = [];
  const now = new Date();
  
  for (let i = hoursCount - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    
    // Apply different patterns to make the data more realistic
    let patternModifier = 0;
    
    if (pattern === 'increasing') {
      patternModifier = (hoursCount - i) / hoursCount * variance * 2;
    } else if (pattern === 'decreasing') {
      patternModifier = -1 * ((hoursCount - i) / hoursCount * variance * 2);
    } else if (pattern === 'fluctuating') {
      patternModifier = Math.sin(i / 2) * variance;
    }
    
    const randomVariance = (Math.random() - 0.5) * variance;
    const value = baseValue + randomVariance + patternModifier;
    data.push({ timestamp, value: Number(value.toFixed(1)) });
  }
  
  return data;
};

// Generate ECG-like data with more frequent intervals (every 15 minutes)
export const generateECGData = (patternType: 'normal' | 'irregular' | 'critical' = 'normal'): VitalSign[] => {
  const data: VitalSign[] = [];
  const now = new Date();
  
  for (let i = 95; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000).toISOString();
    
    // Simulate ECG-like pattern with some noise
    let value;
    if (patternType === 'normal') {
      value = Math.sin(i * 0.3) * 0.5 + 1.5 + (Math.random() * 0.2);
    } else if (patternType === 'irregular') {
      value = Math.sin(i * 0.3) * 0.6 + Math.cos(i * 0.5) * 0.3 + 1.5 + (Math.random() * 0.3);
    } else { // critical
      value = Math.sin(i * 0.4) * 0.7 + Math.sin(i * 0.8) * 0.4 + 1.8 + (Math.random() * 0.4);
      if (i % 7 === 0) value += 0.8; // Simulate occasional spikes
    }
    
    data.push({ timestamp, value: Number(value.toFixed(2)) });
  }
  
  return data;
};

export const getStatusColor = (status: 'normal' | 'warning' | 'critical'): string => {
  switch (status) {
    case 'normal':
      return 'bg-status-normal';
    case 'warning':
      return 'bg-status-warning';
    case 'critical':
      return 'bg-status-critical';
    default:
      return 'bg-gray-300';
  }
};

export const getStatusText = (status: 'normal' | 'warning' | 'critical'): string => {
  switch (status) {
    case 'normal':
      return 'Normal';
    case 'warning':
      return 'Warning';
    case 'critical':
      return 'Critical';
    default:
      return 'Unknown';
  }
};
