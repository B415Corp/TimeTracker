import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "./baseQueryWithErrorHandling";

export interface TaskNote {
  task_note_id: string;
  task_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const taskNoteService = createApi({
  reducerPath: "task-note-service",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["task-note"],
  endpoints: (builder) => ({
    getTaskNote: builder.query<TaskNote | null, { task_id: string }>({
      query: ({ task_id }) => ({
        url: `tasks/${task_id}/note`,
        method: "GET",
      }),
      providesTags: ["task-note"],
      transformResponse: (response: { data: TaskNote | null }) => response.data,
    }),
    upsertTaskNote: builder.mutation<TaskNote, { task_id: string; content: string }>({
      query: ({ task_id, content }) => ({
        url: `tasks/${task_id}/note`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: ["task-note"],
      transformResponse: (response: { data: TaskNote }) => response.data,
    }),
  }),
});

export const { useGetTaskNoteQuery, useUpsertTaskNoteMutation } = taskNoteService; 