import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import type { Role } from "@/store/authSlice";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  loginPath?: string;
}

export const ProtectedRoute = ({ allowedRoles, loginPath = "/login" }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </main>
    );
  }

  if (!isAuthenticated) return <Navigate replace to={loginPath} state={{ from: location }} />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate replace to="/403" />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  if (isAuthenticated && user) return <Navigate replace to={`/${user.role === "hr" ? "recruiter" : user.role}`} />;
  return <Outlet />;
};
