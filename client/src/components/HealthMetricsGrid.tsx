
import React from 'react';
import { Heart, Thermometer, Activity, Wind } from 'lucide-react';
import MetricCard from './MetricCard';
import { PatientVitals } from '@/data/types';

interface HealthMetricsGridProps {
  vitals: PatientVitals;
}

const HealthMetricsGrid: React.FC<HealthMetricsGridProps> = ({ vitals }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricCard
        title="Body Temperature"
        value={vitals.temperature.current}
        unit={vitals.temperature.unit}
        subtitle={`Min: ${vitals.temperature.min}${vitals.temperature.unit} | Max: ${vitals.temperature.max}${vitals.temperature.unit}`}
        color="#FF5757" // temperature.DEFAULT
        chartColor="#FF5757"
        icon={<Thermometer className="h-6 w-6 text-temperature-DEFAULT" />}
        status={vitals.temperature.status}
        chartData={vitals.temperature.history}
      />
      
      <MetricCard
        title="Oxygen Level"
        value={vitals.oxygenLevel.current}
        unit={vitals.oxygenLevel.unit}
        subtitle={`Min: ${vitals.oxygenLevel.min}${vitals.oxygenLevel.unit} | Max: ${vitals.oxygenLevel.max}${vitals.oxygenLevel.unit}`}
        color="#00B4D8" // oxygen.DEFAULT
        chartColor="#00B4D8"
        icon={<Activity className="h-6 w-6 text-oxygen-DEFAULT" />}
        status={vitals.oxygenLevel.status}
        chartData={vitals.oxygenLevel.history}
      />
      
      <MetricCard
        title="Heart Rate"
        value={vitals.pulse.current}
        unit={vitals.pulse.unit}
        subtitle={`Min: ${vitals.pulse.min}${vitals.pulse.unit} | Max: ${vitals.pulse.max}${vitals.pulse.unit}`}
        color="#C77DFF" // pulse.DEFAULT
        chartColor="#C77DFF"
        icon={<Heart className="h-6 w-6 text-pulse-DEFAULT" />}
        status={vitals.pulse.status}
        chartData={vitals.pulse.history}
      />
      
      <MetricCard
        title="Respiration Rate"
        value={vitals.respirationRate.current}
        unit={vitals.respirationRate.unit}
        subtitle={`Min: ${vitals.respirationRate.min}${vitals.respirationRate.unit} | Max: ${vitals.respirationRate.max}${vitals.respirationRate.unit}`}
        color="#4CAF50" // Respiration color
        chartColor="#4CAF50"
        icon={<Wind className="h-6 w-6 text-green-500" />}
        status={vitals.respirationRate.status}
        chartData={vitals.respirationRate.history}
      />
      
      <MetricCard
        title="ECG Monitor"
        value="Real-time"
        color="#38B000" // ecg.DEFAULT
        chartColor="#38B000"
        icon={<Activity className="h-6 w-6 text-ecg-DEFAULT" />}
        status={vitals.ecg.status}
        chartData={vitals.ecg.history}
      />
    </div>
  );
};

export default HealthMetricsGrid;
