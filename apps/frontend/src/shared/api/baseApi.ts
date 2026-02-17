import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from './baseQueryWithErrorHandling';

export const baseApi = createApi({
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    'Documents',
    'DocumentBlocks',
    'CustomFields',
    'DocumentMembers',
    'DocumentComments',
    'DocumentFiles',
    'DocumentVersions',
  ],
  endpoints: () => ({}),
});
