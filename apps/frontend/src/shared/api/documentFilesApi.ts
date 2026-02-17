import { baseApi } from './baseApi';

export interface DocumentFile {
  file_id: string;
  document_id: string;
  block_id?: string;
  filename: string;
  path: string;
  mime_type: string;
  size: number;
  uploaded_by: string;
  created_at: string;
}

export const documentFilesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      DocumentFile,
      { documentId: string; file: File; blockId?: string }
    >({
      query: ({ documentId, file, blockId }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (blockId) {
          formData.append('blockId', blockId);
        }
        return {
          url: `documents/${documentId}/files`,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: { data: DocumentFile }) => response.data,
      invalidatesTags: ['DocumentFiles'],
    }),

    getFilesByDocument: builder.query<DocumentFile[], string>({
      query: (documentId) => `documents/${documentId}/files`,
      transformResponse: (response: { data: DocumentFile[] }) => response.data || [],
      providesTags: (_result, _error, documentId) => [{ type: 'DocumentFiles', id: documentId }],
    }),

    deleteFile: builder.mutation<void, string>({
      query: (fileId) => ({
        url: `files/${fileId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DocumentFiles'],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetFilesByDocumentQuery,
  useDeleteFileMutation,
} = documentFilesApi;
