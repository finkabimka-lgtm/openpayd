import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128)
});

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  surname: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
  balance: z.coerce.number().finite().min(0).max(9999999999.99)
});

export const updateCustomerSchema = z.object({
  balance: z.coerce.number().finite().min(0).max(9999999999.99)
});
