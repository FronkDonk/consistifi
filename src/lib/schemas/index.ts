import { z } from "zod";

export const signInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().nonempty(),
});

export const signUpFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
