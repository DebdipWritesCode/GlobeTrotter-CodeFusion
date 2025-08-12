import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Users,
  UserCheck,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const routes = [
    
    { label: "Manage Cities", path: "/admin/cities", icon: Settings },
    { label: "Manage Users", path: "/admin/users", icon: UserCheck },
    { label: "Manage Activities", path: "/admin/activities", icon: Users },
    { label: "See Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gradient-to-r from-primary/10 to-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>

      <div className="relative w-full max-w-2xl">
        <div className="relative bg-card/80 backdrop-blur-lg border border-border/50 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-2xl mb-4 shadow-lg">
              <Settings className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
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
                  className="group relative h-16 bg-card/60 hover:bg-card/80 border border-border/50 hover:border-border text-foreground hover:text-foreground shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3 w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-4 h-4 text-primary-foreground" />
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

      <style>
        {`@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}`}
      </style>
    </div>
  );
};

export default Dashboard;
