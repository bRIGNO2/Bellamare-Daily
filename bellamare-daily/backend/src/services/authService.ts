import { prisma } from "../config/prisma";
import { ApiError } from "../types";

export interface RegisterInput {
  nome: string;
  piazzola: string;
  cognome?: string;
  telefono?: string;
}

export interface UpdateProfileInput {
  nome?: string;
  cognome?: string;
  telefono?: string;
  piazzola?: string;
}

export async function registerUser(input: RegisterInput) {
  const user = await prisma.user.create({
    data: {
      nome: input.nome.trim(),
      piazzola: input.piazzola.trim(),
      cognome: input.cognome?.trim() || null,
      telefono: input.telefono?.trim() || null,
    },
  });
  return user;
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "NOT_FOUND", "Profilo non trovato.");
  }
  return user;
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput) {
  await getUserById(userId); // 404 se non esiste
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.nome !== undefined ? { nome: input.nome.trim() } : {}),
      ...(input.cognome !== undefined ? { cognome: input.cognome.trim() || null } : {}),
      ...(input.telefono !== undefined ? { telefono: input.telefono.trim() || null } : {}),
      ...(input.piazzola !== undefined ? { piazzola: input.piazzola.trim() } : {}),
    },
  });
  return user;
}
