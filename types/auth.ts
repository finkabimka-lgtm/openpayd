import type { Role } from "@prisma/client";

export type AuthUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: Role;
  balance: number;
  createdAt: string;
};

export type SessionPayload = {
  sub: string;
  email: string;
  role: Role;
  name: string;
  surname: string;
};
