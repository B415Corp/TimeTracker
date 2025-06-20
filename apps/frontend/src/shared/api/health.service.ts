import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

interface HealthResponse {
  status: string;
}

export const healthService = createApi({
  reducerPath: "health-service",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    getHealth: builder.query<HealthResponse, void>({
      query: () => ({
        url: "/health",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetHealthQuery } = healthService; 