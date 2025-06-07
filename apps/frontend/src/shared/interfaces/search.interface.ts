import { z } from "zod";

import { ProjectSchema } from "../../entities/project/project.interface";
import { TaskSchema } from "./task.interface";
import { UserSchema } from "./user.interface";
import { ClientSchema } from "@/entities/client/client.interface";

export const SearchSchema = z.object({
  projects: z.array(ProjectSchema),
  tasks: z.array(TaskSchema),
  clients: z.array(ClientSchema),
  users: z.array(UserSchema),
});

export type Search = z.infer<typeof SearchSchema>;
