import { baseApi } from './baseApi';

export interface Comment {
  comment_id: string;
  document_id: string;
  block_id?: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    user_id: string;
    name: string;
    email: string;
  };
}

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentComments: builder.query<Comment[], string>({
      query: (documentId) => `documents/${documentId}/comments`,
      transformResponse: (response: { data: Comment[] }) => response.data || [],
      providesTags: (_result, _error, documentId) => [{ type: 'Comments' as const, id: documentId }],
    }),

    addComment: builder.mutation<Comment, { documentId: string; content: string; blockId?: string }>({
      query: ({ documentId, content, blockId }) => ({
        url: `documents/${documentId}/comments`,
        method: 'POST',
        body: { content, block_id: blockId },
      }),
      transformResponse: (response: { data: Comment }) => response.data,
      invalidatesTags: (_result, _error, { documentId }) => [{ type: 'Comments' as const, id: documentId }],
    }),

    updateComment: builder.mutation<Comment, { commentId: string; content: string }>({
      query: ({ commentId, content }) => ({
        url: `comments/${commentId}`,
        method: 'PATCH',
        body: { content },
      }),
      transformResponse: (response: { data: Comment }) => response.data,
      invalidatesTags: ['Comments' as const],
    }),

    deleteComment: builder.mutation<void, string>({
      query: (commentId) => ({
        url: `comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments' as const],
    }),
  }),
});

export const {
  useGetDocumentCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
