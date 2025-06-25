import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import { Search, SearchSchema } from "../interfaces/search.interface";
import {validateWithSchema} from "@/lib/validator";


type SearchLocation = "all" | "projects" | "tasks" | "clients" | "users";

export const searchService = createApi({
  reducerPath: "search-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["search-v2"],
  endpoints: (builder) => ({
    searcV2: builder.query<
      Search,
      { searchLocation: SearchLocation; searchTerm?: string }
    >({
      query: ({ searchLocation = "all", searchTerm }) => {
        const params = new URLSearchParams();
        if (searchLocation) params.append("searchLocation", searchLocation);
        if (searchTerm) params.append("searchTerm", searchTerm);

        // путь для версии v2; baseUrl автоматически подставится из fetchBaseQuery (/api/v1), поэтому используем относительный переход на уровень выше

        return {
          url: `../v2/search?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: { data: Search }) => {
        return validateWithSchema<Search>(
          SearchSchema,
          response.data,
          "searcV2"
        );
      },
      providesTags: ["search-v2"],
    }),
  }),
});

export const { useLazySearcV2Query, useSearcV2Query } = searchService;
