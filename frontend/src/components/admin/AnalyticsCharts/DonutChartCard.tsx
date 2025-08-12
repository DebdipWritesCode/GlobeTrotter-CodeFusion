import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ExpenseData {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartCardProps {
  title: string;
  data: ExpenseData[];
  icon?: React.ReactNode;
}

const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#EC4899", // Pink
];

const DonutChartCard: React.FC<DonutChartCardProps> = ({ title, data, icon }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ${data.value.toLocaleString()} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap gap-2 mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 dark:text-gray-300">{entry.value}</span>
          <span className="text-gray-500 dark:text-gray-400">
            ({((entry.payload.value / total) * 100).toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );

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
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="transparent"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                ${total.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Expenses</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {data.length}
              </p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutChartCard;


