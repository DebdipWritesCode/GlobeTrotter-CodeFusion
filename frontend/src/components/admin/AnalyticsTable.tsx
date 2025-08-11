import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface ActivityData {
  id: string;
  title: string;
  city: string;
  uses: number;
  avg_cost: number;
}

interface AnalyticsTableProps {
  title: string;
  data: ActivityData[];
  icon?: React.ReactNode;
}

const AnalyticsTable: React.FC<AnalyticsTableProps> = ({ title, data, icon }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="bg-card/50 dark:bg-card/30 border-border/50 hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          {title}
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 bg-background border-border focus:border-primary"
          />
        </div>
      </CardHeader>
      <CardContent className="bg-transparent">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Activity
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  City
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Uses
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Avg Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-3">
                        {index + 1 + startIndex}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground">ID: {item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-foreground">{item.city}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {item.uses.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-foreground">
                      ${item.avg_cost.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-border bg-background text-foreground hover:bg-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-border bg-background text-foreground hover:bg-accent"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {data.length}
              </p>
              <p className="text-xs text-muted-foreground">Total Activities</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {data.reduce((sum, item) => sum + item.uses, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Uses</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                ${Math.round(data.reduce((sum, item) => sum + item.avg_cost, 0) / data.length).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Avg Cost</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTable;


