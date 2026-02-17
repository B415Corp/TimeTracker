import { baseApi } from './baseApi';
import { DocumentMember, DocumentRole } from '../types/document.types';

export const documentMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addMember: builder.mutation<DocumentMember, { documentId: string; user_id: string; role: DocumentRole }>({
      query: ({ documentId, ...body }) => ({
        url: `documents/${documentId}/members`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: DocumentMember }) => response.data,
      invalidatesTags: (_result, _error, { documentId }) => [{ type: 'DocumentMembers', id: documentId }],
    }),

    getMembersByDocument: builder.query<DocumentMember[], string>({
      query: (documentId) => `documents/${documentId}/members`,
      transformResponse: (response: { data: DocumentMember[] }) => response.data || [],
      providesTags: (_result, _error, documentId) => [{ type: 'DocumentMembers', id: documentId }],
    }),

    updateMemberRole: builder.mutation<DocumentMember, { documentId: string; memberId: string; role: DocumentRole }>({
      query: ({ documentId, memberId, role }) => ({
        url: `documents/${documentId}/members/${memberId}`,
        method: 'PATCH',
        body: { role },
      }),
      transformResponse: (response: { data: DocumentMember }) => response.data,
      invalidatesTags: (_result, _error, { documentId }) => [{ type: 'DocumentMembers', id: documentId }],
    }),

    removeMember: builder.mutation<void, { documentId: string; memberId: string }>({
      query: ({ documentId, memberId }) => ({
        url: `documents/${documentId}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { documentId }) => [{ type: 'DocumentMembers', id: documentId }],
    }),

    checkAccess: builder.query<{ hasAccess: boolean; role: DocumentRole | null }, string>({
      query: (documentId) => `documents/${documentId}/access`,
      transformResponse: (response: { data: { hasAccess: boolean; role: DocumentRole | null } }) => response.data,
    }),
  }),
});

export const {
  useAddMemberMutation,
  useGetMembersByDocumentQuery,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
  useCheckAccessQuery,
} = documentMembersApi;
