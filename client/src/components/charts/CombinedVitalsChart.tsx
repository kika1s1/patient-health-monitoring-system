
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveMultipleChart from './ResponsiveMultipleChart';
import { PatientVitals } from '@/utils/types';

interface CombinedVitalsChartProps {
  vitals: PatientVitals;
}

const CombinedVitalsChart: React.FC<CombinedVitalsChartProps> = ({ vitals }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">24-Hour Health Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-temperature-DEFAULT mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Temperature ({vitals.temperature.unit})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-oxygen-DEFAULT mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Oxygen ({vitals.oxygenLevel.unit})</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded bg-pulse-DEFAULT mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Pulse ({vitals.pulse.unit})</span>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveMultipleChart 
              temperatureData={vitals.temperature.history} 
              oxygenData={vitals.oxygenLevel.history}
              pulseData={vitals.pulse.history}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CombinedVitalsChart;
