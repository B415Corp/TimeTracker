import { baseApi } from './baseApi';
import { DocumentRole } from '../types/document.types';

export interface DocumentMember {
  member_id: string;
  document_id: string;
  user_id: string;
  role: DocumentRole;
  added_at: string;
  user?: {
    user_id: string;
    name: string;
    email: string;
  };
}

export const documentMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentMembers: builder.query<DocumentMember[], string>({
      query: (documentId) => `documents/${documentId}/members`,
      transformResponse: (response: { data: DocumentMember[] }) => response.data || [],
      providesTags: (_result, _error, documentId) => [{ type: 'DocumentMembers' as const, id: documentId }],
    }),

    addDocumentMember: builder.mutation<
      DocumentMember,
      { documentId: string; userId: string; role: DocumentRole }
    >({
      query: ({ documentId, userId, role }) => ({
        url: `documents/${documentId}/members`,
        method: 'POST',
        body: { user_id: userId, role },
      }),
      transformResponse: (response: { data: DocumentMember }) => response.data,
      invalidatesTags: (_result, _error, { documentId }) => [
        { type: 'DocumentMembers' as const, id: documentId },
      ],
    }),

    updateDocumentMemberRole: builder.mutation<
      DocumentMember,
      { documentId: string; memberId: string; role: DocumentRole }
    >({
      query: ({ documentId, memberId, role }) => ({
        url: `documents/${documentId}/members/${memberId}`,
        method: 'PATCH',
        body: { role },
      }),
      transformResponse: (response: { data: DocumentMember }) => response.data,
      invalidatesTags: (_result, _error, { documentId }) => [
        { type: 'DocumentMembers' as const, id: documentId },
      ],
    }),

    removeDocumentMember: builder.mutation<void, { documentId: string; memberId: string }>({
      query: ({ documentId, memberId }) => ({
        url: `documents/${documentId}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { documentId }) => [
        { type: 'DocumentMembers' as const, id: documentId },
      ],
    }),
  }),
});

export const {
  useGetDocumentMembersQuery,
  useAddDocumentMemberMutation,
  useUpdateDocumentMemberRoleMutation,
  useRemoveDocumentMemberMutation,
} = documentMembersApi;
