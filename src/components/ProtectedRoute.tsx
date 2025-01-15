import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOnly,
  admin,
  redirect = "/",
}: Props) => {
  if (!isAuthenticated) return <Navigate to={"/Login"} />;

  if (adminOnly && !admin) return <Navigate to={"/Login"} />;

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
