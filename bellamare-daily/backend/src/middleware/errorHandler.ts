import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../types";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Dati non validi.",
        details: err.flatten(),
      },
    });
  }

  console.error("Errore non gestito:", err);
  return res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Errore interno del server." },
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Risorsa non trovata." } });
}
