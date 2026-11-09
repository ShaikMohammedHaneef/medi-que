import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import axiosInstance from "../api/axiosInstance";

function ProtectedRoute({ allowedRoles }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function verifyUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const response = await axiosInstance.get("/auth/me");

        const userRole = response.data.role;

        if (allowedRoles.includes(userRole)) {
          setStatus("authorized");
        } else {
          setStatus("forbidden");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setStatus("unauthenticated");
        } else {
          setStatus("error");
        }
      }
    }

    verifyUser();
  }, [allowedRoles]);

  if (status === "loading") {
    return <div className="p-6">Verifying authentication...</div>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/auth/login" replace />;
  }

  if (status === "forbidden") {
    return <div className="p-6">You are not authorized to access this page.</div>;
  }

  if (status === "error") {
    return <div className="p-6">Unable to verify your session. Please try again.</div>;
  }

  return <Outlet />;
}

export default ProtectedRoute;