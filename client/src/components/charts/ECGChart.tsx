
import React from 'react';
import CustomLineChart from '@/components/LineChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ECGChartProps {
  ecgData: { timestamp: string; value: number }[];
}

const ECGChart: React.FC<ECGChartProps> = ({ ecgData }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <span className="text-ecg-dark dark:text-ecg-light">ECG Monitoring</span>
          <span className="animate-pulse ml-2 inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <CustomLineChart 
            data={ecgData} 
            color="#38B000"
            name="ECG"
            showGrid={true}
            showAxis={true}
            height={250}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ECGChart;
