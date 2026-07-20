import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function search(req: Request, res: Response) {
  const q = (req.query.search as string) || "";
  const customers = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { nome: { contains: q, mode: "insensitive" } },
            { cognome: { contains: q, mode: "insensitive" } },
            { piazzola: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { piazzola: "asc" },
    take: 100,
  });
  res.json({ customers });
}
