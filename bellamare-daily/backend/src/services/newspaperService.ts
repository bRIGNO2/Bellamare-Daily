import { prisma } from "../config/prisma";
import { ApiError } from "../types";

export async function listActiveNewspapers() {
  return prisma.newspaper.findMany({
    where: { attivo: true },
    orderBy: { nome: "asc" },
  });
}

export async function listAllNewspapers() {
  return prisma.newspaper.findMany({ orderBy: { nome: "asc" } });
}

export async function createNewspaper(nome: string, prezzo: number) {
  return prisma.newspaper.create({ data: { nome: nome.trim(), prezzo, attivo: true } });
}

export async function updateNewspaper(
  id: string,
  data: { nome?: string; prezzo?: number; attivo?: boolean }
) {
  const existing = await prisma.newspaper.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, "NOT_FOUND", "Giornale non trovato.");
  }
  return prisma.newspaper.update({
    where: { id },
    data: {
      ...(data.nome !== undefined ? { nome: data.nome.trim() } : {}),
      ...(data.prezzo !== undefined ? { prezzo: data.prezzo } : {}),
      ...(data.attivo !== undefined ? { attivo: data.attivo } : {}),
    },
  });
}
