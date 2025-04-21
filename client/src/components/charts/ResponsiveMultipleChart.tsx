
import React from 'react';
import * as RechartsComponents from 'recharts';

interface ResponsiveMultipleChartProps {
  temperatureData: { timestamp: string; value: number }[];
  oxygenData: { timestamp: string; value: number }[];
  pulseData: { timestamp: string; value: number }[];
}

const ResponsiveMultipleChart: React.FC<ResponsiveMultipleChartProps> = ({ 
  temperatureData, 
  oxygenData, 
  pulseData 
}) => {
  // Create normalized data array by timestamp
  const combinedData = temperatureData.map((item, index) => {
    return {
      timestamp: item.timestamp,
      temperature: item.value,
      oxygen: oxygenData[index]?.value || 0,
      pulse: pulseData[index]?.value || 0,
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  });

  // Format x-axis ticks
  const formatXAxis = (value: string) => {
    const date = new Date(value);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <RechartsComponents.ResponsiveContainer width="100%" height="100%">
      <RechartsComponents.LineChart
        data={combinedData}
        margin={{
          top: 10,
          right: 30,
          left: 10,
          bottom: 20,
        }}
      >
        <RechartsComponents.CartesianGrid strokeDasharray="3 3" />
        <RechartsComponents.XAxis 
          dataKey="timestamp" 
          tickFormatter={formatXAxis} 
          interval="preserveStartEnd"
          tick={{ fontSize: 10 }}
        />
        <RechartsComponents.YAxis yAxisId="temp" orientation="left" domain={[35, 40]} tick={{ fontSize: 10 }} />
        <RechartsComponents.YAxis yAxisId="oxygen" orientation="right" domain={[85, 100]} tick={{ fontSize: 10 }} />
        <RechartsComponents.YAxis yAxisId="pulse" orientation="right" domain={[40, 120]} hide />
        <RechartsComponents.Tooltip 
          formatter={(value: number, name: string) => {
            if (name === 'temperature') return [`${value}°C`, 'Temperature'];
            if (name === 'oxygen') return [`${value}%`, 'Oxygen'];
            if (name === 'pulse') return [`${value} bpm`, 'Pulse'];
            return [value, name];
          }}
          labelFormatter={(label) => {
            const date = new Date(label);
            return date.toLocaleString();
          }}
        />
        <RechartsComponents.Legend />
        <RechartsComponents.Line
          yAxisId="temp"
          type="monotone"
          dataKey="temperature"
          name="temperature"
          stroke="#FF5757"
          dot={false}
          strokeWidth={2}
        />
        <RechartsComponents.Line
          yAxisId="oxygen"
          type="monotone"
          dataKey="oxygen"
          name="oxygen"
          stroke="#00B4D8"
          dot={false}
          strokeWidth={2}
        />
        <RechartsComponents.Line
          yAxisId="pulse"
          type="monotone"
          dataKey="pulse"
          name="pulse"
          stroke="#C77DFF"
          dot={false}
          strokeWidth={2}
        />
      </RechartsComponents.LineChart>
    </RechartsComponents.ResponsiveContainer>
  );
};

export default ResponsiveMultipleChart;
