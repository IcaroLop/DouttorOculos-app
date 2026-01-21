import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useRedux';
import { selectIsAuthenticated } from '../redux/slices/authSlice';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
