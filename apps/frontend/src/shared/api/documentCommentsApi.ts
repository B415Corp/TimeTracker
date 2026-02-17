import { baseApi } from './baseApi';
import { DocumentComment } from '../types/document.types';

export const documentCommentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDocumentComment: builder.mutation<DocumentComment, { documentId: string; content: string; block_id?: string }>({
      query: ({ documentId, ...body }) => ({
        url: `documents/${documentId}/comments`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: DocumentComment }) => response.data,
      invalidatesTags: (_result, _error, { documentId }) => [{ type: 'DocumentComments', id: documentId }],
    }),

    createBlockComment: builder.mutation<DocumentComment, { blockId: string; content: string }>({
      query: ({ blockId, content }) => ({
        url: `blocks/${blockId}/comments`,
        method: 'POST',
        body: { content },
      }),
      transformResponse: (response: { data: DocumentComment }) => response.data,
      invalidatesTags: ['DocumentComments'],
    }),

    getCommentsByDocument: builder.query<DocumentComment[], string>({
      query: (documentId) => `documents/${documentId}/comments`,
      transformResponse: (response: { data: DocumentComment[] }) => response.data || [],
      providesTags: (_result, _error, documentId) => [{ type: 'DocumentComments', id: documentId }],
    }),

    updateComment: builder.mutation<DocumentComment, { commentId: string; content: string }>({
      query: ({ commentId, content }) => ({
        url: `comments/${commentId}`,
        method: 'PATCH',
        body: { content },
      }),
      transformResponse: (response: { data: DocumentComment }) => response.data,
      invalidatesTags: ['DocumentComments'],
    }),

    deleteComment: builder.mutation<void, string>({
      query: (commentId) => ({
        url: `comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DocumentComments'],
    }),

    replyToComment: builder.mutation<DocumentComment, { commentId: string; content: string }>({
      query: ({ commentId, content }) => ({
        url: `comments/${commentId}/replies`,
        method: 'POST',
        body: { content },
      }),
      transformResponse: (response: { data: DocumentComment }) => response.data,
      invalidatesTags: ['DocumentComments'],
    }),
  }),
});

export const {
  useCreateDocumentCommentMutation,
  useCreateBlockCommentMutation,
  useGetCommentsByDocumentQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useReplyToCommentMutation,
} = documentCommentsApi;
