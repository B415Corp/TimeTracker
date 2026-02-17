import { baseApi } from './baseApi';
import { CustomField, DocumentFieldValue, FieldType } from '../types/document.types';

export const customFieldsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createField: builder.mutation<
      CustomField,
      { projectId: string; name: string; type: FieldType; config?: any; is_required?: boolean }
    >({
      query: ({ projectId, ...body }) => ({
        url: `projects/${projectId}/fields`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: CustomField }) => response.data,
      invalidatesTags: (_result, _error, { projectId }) => [{ type: 'CustomFields', id: projectId }],
    }),

    getFieldsByProject: builder.query<CustomField[], string>({
      query: (projectId) => `projects/${projectId}/fields`,
      transformResponse: (response: { data: CustomField[] }) => response.data || [],
      providesTags: (_result, _error, projectId) => [{ type: 'CustomFields', id: projectId }],
    }),

    updateField: builder.mutation<CustomField, { fieldId: string; name?: string; config?: any; is_required?: boolean }>({
      query: ({ fieldId, ...body }) => ({
        url: `fields/${fieldId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { data: CustomField }) => response.data,
      invalidatesTags: ['CustomFields'],
    }),

    deleteField: builder.mutation<void, string>({
      query: (fieldId) => ({
        url: `fields/${fieldId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CustomFields'],
    }),

    setFieldValue: builder.mutation<DocumentFieldValue, { documentId: string; fieldId: string; value: any }>({
      query: ({ documentId, fieldId, value }) => ({
        url: `documents/${documentId}/fields/${fieldId}/value`,
        method: 'POST',
        body: { value },
      }),
      transformResponse: (response: { data: DocumentFieldValue }) => response.data,
      invalidatesTags: (_result, _error, { documentId }) => [{ type: 'CustomFields', id: `${documentId}-values` }],
    }),

    getDocumentFieldValues: builder.query<DocumentFieldValue[], string>({
      query: (documentId) => `documents/${documentId}/fields`,
      transformResponse: (response: { data: DocumentFieldValue[] }) => response.data || [],
      providesTags: (_result, _error, documentId) => [{ type: 'CustomFields', id: `${documentId}-values` }],
    }),
  }),
});

export const {
  useCreateFieldMutation,
  useGetFieldsByProjectQuery,
  useUpdateFieldMutation,
  useDeleteFieldMutation,
  useSetFieldValueMutation,
  useGetDocumentFieldValuesQuery,
} = customFieldsApi;
