import { baseApi } from './baseApi';
import { DocumentBlock, BlockType } from '../types/document.types';

export const documentBlocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBlock: builder.mutation<
      DocumentBlock,
      { documentId: string; type: BlockType; content: any; order?: number; parent_block_id?: string; properties?: any }
    >({
      query: ({ documentId, ...body }) => ({
        url: `documents/${documentId}/blocks`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: DocumentBlock }) => response.data,
      invalidatesTags: (_result, _error, { documentId }) => [{ type: 'DocumentBlocks', id: documentId }],
    }),

    getBlocksByDocument: builder.query<DocumentBlock[], string>({
      query: (documentId) => `documents/${documentId}/blocks`,
      transformResponse: (response: { data: DocumentBlock[] }) => response.data || [],
      providesTags: (_result, _error, documentId) => [{ type: 'DocumentBlocks', id: documentId }],
    }),

    updateBlock: builder.mutation<
      DocumentBlock,
      { blockId: string; type?: BlockType; content?: any; properties?: any }
    >({
      query: ({ blockId, ...body }) => ({
        url: `blocks/${blockId}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { data: DocumentBlock }) => response.data,
      invalidatesTags: (_result, _error, { blockId }) => [{ type: 'DocumentBlocks', id: blockId }],
    }),

    deleteBlock: builder.mutation<void, string>({
      query: (blockId) => ({
        url: `blocks/${blockId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DocumentBlocks'],
    }),

    reorderBlocks: builder.mutation<
      DocumentBlock[],
      { documentId: string; blocks: { block_id: string; order: number }[] }
    >({
      query: ({ documentId, blocks }) => ({
        url: `documents/${documentId}/blocks/reorder`,
        method: 'POST',
        body: { blocks },
      }),
      transformResponse: (response: { data: DocumentBlock[] }) => response.data || [],
      invalidatesTags: (_result, _error, { documentId }) => [{ type: 'DocumentBlocks', id: documentId }],
    }),

    convertBlock: builder.mutation<DocumentBlock, { blockId: string; type: BlockType }>({
      query: ({ blockId, type }) => ({
        url: `blocks/${blockId}/convert`,
        method: 'POST',
        body: { type },
      }),
      transformResponse: (response: { data: DocumentBlock }) => response.data,
      invalidatesTags: (_result, _error, { blockId }) => [{ type: 'DocumentBlocks', id: blockId }],
    }),
  }),
});

export const {
  useCreateBlockMutation,
  useGetBlocksByDocumentQuery,
  useUpdateBlockMutation,
  useDeleteBlockMutation,
  useReorderBlocksMutation,
  useConvertBlockMutation,
} = documentBlocksApi;
