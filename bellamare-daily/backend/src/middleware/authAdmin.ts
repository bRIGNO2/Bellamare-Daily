import { NextFunction, Request, Response } from "express";
import { verifyAdminToken } from "../utils/jwt";
import { ApiError } from "../types";

export const ADMIN_COOKIE_NAME = "bd_admin_session";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      adminId?: string;
      adminUsername?: string;
    }
  }
}

export function requireAdminAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];
  if (!token) {
    return next(new ApiError(401, "UNAUTHENTICATED", "Accesso amministratore richiesto."));
  }
  try {
    const payload = verifyAdminToken(token);
    req.adminId = payload.adminId;
    req.adminUsername = payload.username;
    next();
  } catch {
    return next(new ApiError(401, "UNAUTHENTICATED", "Sessione amministratore non valida o scaduta."));
  }
}
