import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetHealthQuery } from "@/shared/api/health.service";

const OfflinePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    refetch,
    isFetching,
  } = useGetHealthQuery(undefined, { skip: true });

  const handleCheck = async () => {
    const result = await refetch();
    if (!result.error) {
      const stateReturn = (location.state as { returnTo?: string })?.returnTo;
      const storedReturn = sessionStorage.getItem("returnTo");
      const returnTo = stateReturn || storedReturn || "/";
      if (storedReturn) {
        sessionStorage.removeItem("returnTo");
      }
      navigate(returnTo, { replace: true });
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-bold">Соединение с сервером потеряно</h1>
      <p className="text-muted-foreground max-w-md">
        Мы не смогли установить соединение с сервером. Пожалуйста, убедитесь, что
        у вас есть доступ к сети и сервер запущен.
      </p>
      <button
        onClick={handleCheck}
        disabled={isFetching}
        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-60"
      >
        {isFetching ? "Проверка..." : "Проверь соединение"}
      </button>
    </div>
  );
};

export default OfflinePage; 