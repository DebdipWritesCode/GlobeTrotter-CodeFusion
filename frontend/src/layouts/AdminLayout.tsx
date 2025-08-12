
import LogoutDialog from '@/components/auth/LogoutMenuItem';

import ThemeToggle from '@/components/ThemeToggle';

import { Outlet, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Button } from '@/components/ui/button';

const AdminLayout = () => {
  // Remove global body padding-top (added for main site navbar) while in admin pages
  useEffect(() => {
    const prevPadding = document.body.style.paddingTop;
    document.body.style.paddingTop = '0px';
    return () => {
      document.body.style.paddingTop = prevPadding;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-xl font-bold text-foreground">
              Admin Panel
            </Link>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/">View Site</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
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
