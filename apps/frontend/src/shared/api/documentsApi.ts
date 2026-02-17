import { baseApi } from './baseApi';
import { Document } from '../types/document.types';

export const documentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDocument: builder.mutation<
      Document,
      { projectId: string; title: string; parent_document_id?: string; icon?: string; cover_image?: string }
    >({
      query: ({ projectId, ...body }) => ({
        url: `projects/${projectId}/documents`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: Document }) => response.data,
      invalidatesTags: ['Documents'],
    }),

    getDocumentsByProject: builder.query<Document[], string>({
      query: (projectId) => `projects/${projectId}/documents`,
      transformResponse: (response: { data: Document[] }) => response.data || [],
      providesTags: ['Documents'],
    }),

    getDocument: builder.query<Document, string>({
      query: (documentId) => `documents/${documentId}`,
      transformResponse: (response: { data: Document }) => response.data,
      providesTags: (_result, _error, documentId) => [{ type: 'Documents', id: documentId }],
    }),

    updateDocument: builder.mutation<
      Document,
      { documentId: string; title?: string; icon?: string; cover_image?: string }
    >({
      query: ({ documentId, ...body }) => ({
        url: `documents/${documentId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { data: Document }) => response.data,
      invalidatesTags: (_result, _error, { documentId }) => [
        { type: 'Documents', id: documentId },
        'Documents',
      ],
    }),

    deleteDocument: builder.mutation<void, string>({
      query: (documentId) => ({
        url: `documents/${documentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents'],
    }),

    moveDocument: builder.mutation<Document, { documentId: string; parent_document_id?: string | null }>({
      query: ({ documentId, parent_document_id }) => ({
        url: `documents/${documentId}/move`,
        method: 'POST',
        body: { parent_document_id },
      }),
      transformResponse: (response: { data: Document }) => response.data,
      invalidatesTags: ['Documents'],
    }),

    getDocumentTree: builder.query<Document, string>({
      query: (documentId) => `documents/${documentId}/tree`,
      transformResponse: (response: { data: Document }) => response.data,
      providesTags: (_result, _error, documentId) => [{ type: 'Documents', id: `${documentId}-tree` }],
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useGetDocumentsByProjectQuery,
  useGetDocumentQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useMoveDocumentMutation,
  useGetDocumentTreeQuery,
} = documentsApi;
