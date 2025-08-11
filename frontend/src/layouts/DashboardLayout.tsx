import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LogoutDialog from '@/components/auth/LogoutMenuItem';
import ChatBubble from '@/components/ChatBubble';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LogoutDialog />
        <ChatBubble />
      </div>

      {/* Main content */}
      <main className="flex-1 mt-4 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
