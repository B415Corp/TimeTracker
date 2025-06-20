import { z } from "zod";

// ClientSchema
export const ClientSchema = z.object({
  client_id: z.string(),
  name: z.string(),
  additional_fields: z
    .array(
      z.object({ type: z.string(), value: z.string() })
    )
    .nullable()
    .optional(),
});

// CreateClientDTOSchema
export const CreateClientDTOSchema = z.object({
  client_id: z.string(),
  name: z.string(),
  additional_fields: z
    .array(
      z.object({ type: z.string(), value: z.string() })
    )
    .nullable()
    .optional(),
});

export type Client = z.infer<typeof ClientSchema>;
export type CreateClientDTO = z.infer<typeof CreateClientDTOSchema>;
export type EditClientDTO = CreateClientDTO & { additional_fields?: { type: string; value: string }[] | null }; 