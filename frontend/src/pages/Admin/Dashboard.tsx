import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Users,
  UserCheck,
  Building,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const routes = [
    { label: "Manage Cities", path: "/admin/cities", icon: Settings },
    { label: "Manage Users", path: "/admin/users", icon: UserCheck },
    { label: "Manage Activities", path: "/admin/activities", icon: Users },
    { label: "See Analytics", path: "/admin/analytics", icon: Building },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="relative bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your platform with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((route, index) => {
              const Icon = route.icon;
              return (
                <Button
                  key={route.path}
                  onClick={() => navigate(route.path)}
                  className="group relative h-16 bg-white/60 hover:bg-white/80 border border-gray-200/50 hover:border-gray-300/50 text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3 w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                      {route.label}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
