import LogoutDialog from '@/components/auth/LogoutDialog';
import { Outlet, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const AdminLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <div className="space-x-4">
          <Link
            to="/admin/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
          <LogoutDialog />
        </div>
      </header>

      <main className="flex-1 p-6">
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
      />
    </div>
  );
};

export default AdminLayout;
