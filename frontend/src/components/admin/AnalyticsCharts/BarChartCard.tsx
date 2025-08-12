import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface CityData {
  city: string;
  trips: number;
}

interface BarChartCardProps {
  title: string;
  data: CityData[];
  icon?: React.ReactNode;
}

const BarChartCard: React.FC<BarChartCardProps> = ({ title, data, icon }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            {payload[0].value.toLocaleString()} trips
          </p>
        </div>
      );
    }
    return null;
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
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis 
                dataKey="city" 
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
              <Bar 
                dataKey="trips" 
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {data.reduce((sum, item) => sum + item.trips, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Trips</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {data.length}
              </p>
              <p className="text-xs text-muted-foreground">Cities</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {Math.round(data.reduce((sum, item) => sum + item.trips, 0) / data.length).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Avg per City</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChartCard;


