import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import LogoutDialog from '@/components/auth/LogoutDialog';

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className=" absolute top-8 right-0">
        <LogoutDialog />
      </div>
      <div className="flex-1 mt-20 ml-15">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
