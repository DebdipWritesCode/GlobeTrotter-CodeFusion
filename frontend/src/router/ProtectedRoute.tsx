import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  return token ? children : <Navigate to="/login" replace />;
  // return children
};

export default ProtectedRoute;
