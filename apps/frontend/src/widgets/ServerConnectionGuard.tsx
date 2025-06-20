import React, { JSX, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetHealthQuery } from "@/shared/api/health.service";
import { ROUTES } from "@/app/router/routes.enum";

interface Props {
  children: JSX.Element;
}

const ServerConnectionGuard: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, isLoading } = useGetHealthQuery();

  useEffect(() => {
    if (error) {
      navigate("/" + ROUTES.OFFLINE, { state: { returnTo: location.pathname } });
    }
  }, [error, navigate, location]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  return children;
};

export default ServerConnectionGuard; 