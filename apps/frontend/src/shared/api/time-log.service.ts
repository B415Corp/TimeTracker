import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";
import {
  TimeLog,
  TimeLogSchema,
  LatestLog,
  LatestLogSchema,
} from "@/entities/timer/timer.interface";
import { PaginatedResponse } from "../interfaces/api.interface";
import { validateWithSchema } from "@/lib/validator";
import { TimeLog as NewTimeLog, LatestLog as NewLatestLog } from "@/entities/timer/timer.interface";
import { z } from "zod";

/** Статистика за период (неделя по умолчанию) */
export interface WeeklyStatsResponse {
  projects: { project_id: string; project_name: string; total_duration: number }[];
  top_tasks: { task_id: string; task_name: string; project_id: string; project_name: string; total_duration: number }[];
  start: string;
  end: string;
}

const WeeklyStatsSchema: z.ZodType<WeeklyStatsResponse> = z.object({
  projects: z.array(z.object({
    project_id: z.string(),
    project_name: z.string(),
    total_duration: z.number(),
  })),
  top_tasks: z.array(z.object({
    task_id: z.string(),
    task_name: z.string(),
    project_id: z.string(),
    project_name: z.string(),
    total_duration: z.number(),
  })),
  start: z.string(),
  end: z.string(),
});

export const timeLogService = createApi({
  reducerPath: "time-log-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    "time-log-service",
    "time-log-service-logs",
    "time-log-service-list",
    "time-log-service-latest",
    "time-log-service-lates-task",
  ],
  endpoints: (builder) => ({
    getTimeLogById: builder.query<TimeLog, { id: string }>({
      query: ({ id }) => ({
        url: `time-logs/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { data: TimeLog }) => {
        return validateWithSchema<TimeLog>(TimeLogSchema, response.data);
      },
      providesTags: ["time-log-service"],
    }),
    getTimeLogLatestTask: builder.query<TimeLog, { task_id: string }>({
      query: ({ task_id: id }) => ({
        url: `time-logs/${id}/latest`,
        method: "GET",
      }),
      providesTags: ["time-log-service-lates-task"],
      transformResponse: (response: { data: TimeLog }) => {
        return validateWithSchema<TimeLog>(
          TimeLogSchema,
          response.data,
          "getTimeLogLatestTask"
        );
      },
    }),
    getTimeLogLogs: builder.query<
      PaginatedResponse<TimeLog>,
      { task_id: string; page?: number; limit?: number }
    >({
      query: ({ task_id: id, page = 1, limit = 10 }) => ({
        url: `time-logs/${id}/logs?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      // transformResponse: (response: { data: PaginatedResponse<TimeLog> }) =>
      //   response.data,
      providesTags: ["time-log-service-logs"],
    }),
    getTimeLogLatest: builder.query<LatestLog, void>({
      query: () => ({
        url: `time-logs/latest`,
        method: "GET",
      }),
      transformResponse: (response: { data: LatestLog }) => {
        return validateWithSchema<LatestLog>(
          LatestLogSchema,
          response.data,
          "getTimeLogLatest"
        );
      },
      providesTags: ["time-log-service-latest"],
    }),
    postTimeLogStart: builder.mutation<TimeLog, { task_id: string }>({
      query: ({ task_id }) => ({
        url: `time-logs/${task_id}/start`,
        method: "POST",
        providesTags: ["ttime-log-service-lates-task"],
      }),
      transformResponse: (response: { data: TimeLog }) => {
        return validateWithSchema<TimeLog>(
          TimeLogSchema,
          response.data,
          "postTimeLogStart"
        );
      },
      invalidatesTags: [
        "time-log-service",
        "time-log-service-logs",
        "time-log-service-list",
        "time-log-service-latest",
        "time-log-service-lates-task",
      ],
    }),
    postTimeLogStop: builder.mutation<
      TimeLog,
      { task_id: string; client_time: string }
    >({
      query: ({ task_id, client_time }) => ({
        url: `time-logs/${task_id}/stop?client_time=${client_time}`,
        method: "PATCH",
        providesTags: ["ttime-log-service-lates-task"],
      }),
      transformResponse: (response: { data: TimeLog }) => {
        return validateWithSchema<TimeLog>(
          TimeLogSchema,
          response.data,
          "postTimeLogStop"
        );
      },
      invalidatesTags: [
        "time-log-service",
        "time-log-service-logs",
        "time-log-service-list",
        "time-log-service-latest",
        "time-log-service-lates-task",
      ],
    }),
    postTimeLogManual: builder.mutation<
      TimeLog,
      { task_id: string; duration: number }
    >({
      query: ({ task_id, duration }) => ({
        url: `time-logs/${task_id}/manual`,
        method: "POST",
        body: { duration },
      }),
      transformResponse: (response: { data: TimeLog }) => {
        return validateWithSchema<TimeLog>(
          TimeLogSchema,
          response.data,
          "postTimeLogManual"
        );
      },
      invalidatesTags: [
        "time-log-service",
        "time-log-service-logs",
        "time-log-service-list",
        "time-log-service-latest",
        "time-log-service-lates-task",
      ],
    }),
    updateTimeLog: builder.mutation<TimeLog, { log_id: string; data: Partial<{ start_time: string; end_time: string; duration: number }> }>(
      {
        query: ({ log_id, data }) => ({
          url: `time-logs/log/${log_id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: [
          'time-log-service',
          'time-log-service-logs',
          'time-log-service-lates-task',
        ],
      }),
    deleteTimeLog: builder.mutation<{ success: boolean }, { log_id: string }>(
      {
        query: ({ log_id }) => ({
          url: `time-logs/log/${log_id}`,
          method: 'DELETE',
        }),
        invalidatesTags: [
          'time-log-service',
          'time-log-service-logs',
          'time-log-service-lates-task',
        ],
      }),
    getWeeklyStats: builder.query<WeeklyStatsResponse, void>({
      query: () => ({
        url: 'time-logs/stats?range=7d',
        method: 'GET',
      }),
      transformResponse: (response: { data: WeeklyStatsResponse }) => {
        return validateWithSchema<WeeklyStatsResponse>(
          WeeklyStatsSchema,
          response.data,
          'getWeeklyStats'
        );
      },
      providesTags: ['time-log-service-list'],
    }),
  }),
});

export const {
  useGetTimeLogByIdQuery,
  useGetTimeLogLogsQuery,
  useGetTimeLogLatestQuery,
  usePostTimeLogStartMutation,
  usePostTimeLogStopMutation,
  useGetTimeLogLatestTaskQuery,
  usePostTimeLogManualMutation,
  useUpdateTimeLogMutation,
  useDeleteTimeLogMutation,
  useGetWeeklyStatsQuery,
} = timeLogService;
