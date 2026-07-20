import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AdminTokenPayload, ClientTokenPayload } from "../types";

const CLIENT_EXPIRY = "365d"; // sessione cliente lunga: no login ripetuti
const ADMIN_EXPIRY = "12h";

export function signClientToken(payload: ClientTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: CLIENT_EXPIRY });
}

export function verifyClientToken(token: string): ClientTokenPayload {
  return jwt.verify(token, env.jwtSecret) as ClientTokenPayload;
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, env.jwtAdminSecret, { expiresIn: ADMIN_EXPIRY });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, env.jwtAdminSecret) as AdminTokenPayload;
}
