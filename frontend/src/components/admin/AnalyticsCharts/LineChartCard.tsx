import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartCardProps {
  title: string;
  series: DataPoint[];
  icon?: React.ReactNode;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ title, series, icon }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {payload[0].value.toLocaleString()} trips
          </p>
        </div>
      );
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="bg-card/50 dark:bg-card/30 border-border/50 hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-transparent">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#colorValue)"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {series.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Trips</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {Math.max(...series.map(item => item.value)).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Peak Day</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {Math.round(series.reduce((sum, item) => sum + item.value, 0) / series.length).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Daily Avg</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChartCard;


