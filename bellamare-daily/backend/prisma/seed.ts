import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Giornali demo
  const newspapers = [
    { nome: "Corriere della Sera", prezzo: 1.5 },
    { nome: "La Repubblica", prezzo: 1.5 },
    { nome: "Gazzetta dello Sport", prezzo: 2.0 },
    { nome: "Il Sole 24 Ore", prezzo: 2.5 },
  ];

  for (const n of newspapers) {
    const existing = await prisma.newspaper.findFirst({ where: { nome: n.nome } });
    if (!existing) {
      await prisma.newspaper.create({ data: { ...n, attivo: true } });
    }
  }

  // Admin demo
  const adminUsername = process.env.SEED_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "bellamare2026";
  const existingAdmin = await prisma.admin.findUnique({ where: { username: adminUsername } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({ data: { username: adminUsername, passwordHash } });
    console.log(`Admin creato → username: ${adminUsername} / password: ${adminPassword}`);
  }

  // Cliente demo
  const existingUser = await prisma.user.findFirst({ where: { piazzola: "42" } });
  if (!existingUser) {
    const user = await prisma.user.create({
      data: { nome: "Mario", cognome: "Rossi", piazzola: "42", telefono: "3331234567" },
    });
    console.log(`Cliente demo creato → ${user.nome} (piazzola ${user.piazzola})`);
  }

  console.log("Seed completato.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
