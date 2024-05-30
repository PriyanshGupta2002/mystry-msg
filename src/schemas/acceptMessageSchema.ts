import { z } from "zod";

export const acceptMessageSchema = z.object({
  boolean: z.boolean(),
});
