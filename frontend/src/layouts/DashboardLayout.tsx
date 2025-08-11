import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import LogoutDialog from '@/components/auth/LogoutDialog';
import ThemeToggle from '@/components/ThemeToggle';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LogoutDialog />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
