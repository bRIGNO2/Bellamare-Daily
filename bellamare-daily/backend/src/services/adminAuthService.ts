import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { ApiError } from "../types";

export async function loginAdmin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({ where: { username } });
  if (!admin) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Credenziali non valide.");
  }
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "Credenziali non valide.");
  }
  return admin;
}

export async function getAdminById(adminId: string) {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) {
    throw new ApiError(404, "NOT_FOUND", "Amministratore non trovato.");
  }
  return admin;
}
