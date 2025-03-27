// src/components/Auth/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/" replace />;
}
