import React, { JSX } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { ROUTES } from "./routes.enum";
import { SUBSCRIPTION } from "@/shared/enums/sunscriptions.enum";
import { useSubscription } from "@/hooks/use-subscription";

interface PrivateRouteProps {
  roles: Array<SUBSCRIPTION>;
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { access } = useSubscription(roles);
  const { enqueueSnackbar } = useSnackbar();
  const token = Cookies.get("authToken");
  const isDevMode = import.meta.env.MODE === "dev";

  if (!isDevMode) {
    if (!token) {
      return <Navigate to={ROUTES.AUTH + "/" + ROUTES.LOGIN} />;
    }
    
    if (!access) {
      enqueueSnackbar("У вас нет доступа к этой странице (Подписка)", {
        variant: "error",
      });
      return <Navigate to={ROUTES.AUTH + "/" + ROUTES.NO_ACCESS} />;
    }
  }

  return children;
};

export default PrivateRoute;
