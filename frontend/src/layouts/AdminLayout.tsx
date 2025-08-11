
import LogoutDialog from '@/components/auth/LogoutMenuItem';

import ThemeToggle from '@/components/ThemeToggle';

import { Outlet, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/">Go to Dashboard</Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LogoutDialog />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AdminLayout;
