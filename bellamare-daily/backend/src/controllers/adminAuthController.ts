import { Request, Response } from "express";
import { z } from "zod";
import { env } from "../config/env";
import { ADMIN_COOKIE_NAME } from "../middleware/authAdmin";
import * as adminAuthService from "../services/adminAuthService";
import { signAdminToken } from "../utils/jwt";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const cookieOptions = {
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? ("none" as const) : ("lax" as const),
  maxAge: 12 * 60 * 60 * 1000, // 12h
  path: "/",
};

export async function login(req: Request, res: Response) {
  const { username, password } = loginSchema.parse(req.body);
  const admin = await adminAuthService.loginAdmin(username, password);
  const token = signAdminToken({ adminId: admin.id, username: admin.username });
  res.cookie(ADMIN_COOKIE_NAME, token, cookieOptions);
  res.json({ admin: { id: admin.id, username: admin.username } });
}

export async function me(req: Request, res: Response) {
  const admin = await adminAuthService.getAdminById(req.adminId!);
  res.json({ admin: { id: admin.id, username: admin.username } });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(ADMIN_COOKIE_NAME, { path: "/" });
  res.status(204).send();
}
