import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(6, { message: "Passsword must be 6 or more characters long" }),
});

export const loginSchema = userSchema.omit({ name: true });

export type User = z.infer<typeof userSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
