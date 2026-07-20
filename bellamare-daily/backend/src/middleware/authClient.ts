import { NextFunction, Request, Response } from "express";
import { verifyClientToken } from "../utils/jwt";
import { ApiError } from "../types";

export const CLIENT_COOKIE_NAME = "bd_session";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireClientAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[CLIENT_COOKIE_NAME];
  if (!token) {
    return next(new ApiError(401, "UNAUTHENTICATED", "Sessione non trovata. Registrati per continuare."));
  }
  try {
    const payload = verifyClientToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    return next(new ApiError(401, "UNAUTHENTICATED", "Sessione non valida o scaduta."));
  }
}
