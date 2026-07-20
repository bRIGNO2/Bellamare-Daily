import { Request, Response } from "express";
import { z } from "zod";
import { env } from "../config/env";
import { CLIENT_COOKIE_NAME } from "../middleware/authClient";
import * as authService from "../services/authService";
import { signClientToken } from "../utils/jwt";

const registerSchema = z.object({
  nome: z.string().min(1, "Il nome è obbligatorio").max(100),
  piazzola: z.string().min(1, "Il numero piazzola è obbligatorio").max(20),
  cognome: z.string().max(100).optional(),
  telefono: z.string().max(30).optional(),
});

const updateProfileSchema = z.object({
  nome: z.string().min(1).max(100).optional(),
  piazzola: z.string().min(1).max(20).optional(),
  cognome: z.string().max(100).optional(),
  telefono: z.string().max(30).optional(),
});

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? ("none" as const) : ("lax" as const),
  maxAge: 365 * 24 * 60 * 60 * 1000, // 1 anno
  path: "/",
};

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body);
  const user = await authService.registerUser(data);
  const token = signClientToken({ userId: user.id });
  res.cookie(CLIENT_COOKIE_NAME, token, cookieOptions);
  res.status(201).json({ user });
}

export async function me(req: Request, res: Response) {
  const user = await authService.getUserById(req.userId!);
  res.json({ user });
}

export async function updateMe(req: Request, res: Response) {
  const data = updateProfileSchema.parse(req.body);
  const user = await authService.updateUserProfile(req.userId!, data);
  res.json({ user });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(CLIENT_COOKIE_NAME, { path: "/" });
  res.status(204).send();
}
