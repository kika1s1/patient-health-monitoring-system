
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { VitalSign } from '../utils/types';

interface LineChartProps {
  data: VitalSign[];
  color: string;
  dataKey?: string;
  unit?: string;
  name?: string;
  showGrid?: boolean;
  showAxis?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  height?: number;
  formatXAxis?: (value: string) => string;
  domain?: [number, number];
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  color,
  dataKey = 'value',
  unit = '',
  name = 'Value',
  showGrid = true,
  showAxis = true,
  showTooltip = true,
  showLegend = false,
  height = 200,
  formatXAxis,
  domain,
}) => {
  const formattedData = data.map((item) => ({
    ...item,
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    displayTime: `${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ${new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}`
  }));

  const defaultFormatXAxis = (value: string) => {
    const date = new Date(value);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };
  
  const formatAxis = formatXAxis || defaultFormatXAxis;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 20,
          left: showAxis ? 20 : 0,
          bottom: showAxis ? 20 : 0,
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        
        {showAxis && (
          <>
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 10 }} 
              tickFormatter={(value) => formatAxis(value)}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 10 }} 
              width={25} 
              domain={domain}
              tickFormatter={(value) => `${value}${unit}`} 
            />
          </>
        )}
        
        {showTooltip && (
          <Tooltip 
            formatter={(value: number) => [`${value}${unit}`, name]}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleString();
            }}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
        )}
        
        {showLegend && <Legend />}
        
        <Line 
          type="monotone" 
          dataKey={dataKey}
          name={name} 
          stroke={color} 
          strokeWidth={2}
          dot={{ r: 0 }}
          activeDot={{ r: 4, strokeWidth: 0, fill: color }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
