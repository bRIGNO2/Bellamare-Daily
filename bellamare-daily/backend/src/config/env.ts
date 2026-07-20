import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Variabile ambiente mancante: ${name}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: required("DATABASE_URL"),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwtSecret: required("JWT_SECRET", "dev-secret"),
  jwtAdminSecret: required("JWT_ADMIN_SECRET", "dev-admin-secret"),
  orderCutoffHour: parseInt(process.env.ORDER_CUTOFF_HOUR || "19", 10),
  timezone: process.env.TIMEZONE || "Europe/Rome",
  isProd: process.env.NODE_ENV === "production",
};
