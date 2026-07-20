import { Request, Response } from "express";
import { z } from "zod";
import * as newspaperService from "../services/newspaperService";

export async function listActive(_req: Request, res: Response) {
  const newspapers = await newspaperService.listActiveNewspapers();
  res.json({ newspapers });
}

export async function listAll(_req: Request, res: Response) {
  const newspapers = await newspaperService.listAllNewspapers();
  res.json({ newspapers });
}

const createSchema = z.object({
  nome: z.string().min(1).max(100),
  prezzo: z.number().positive(),
});

export async function create(req: Request, res: Response) {
  const { nome, prezzo } = createSchema.parse(req.body);
  const newspaper = await newspaperService.createNewspaper(nome, prezzo);
  res.status(201).json({ newspaper });
}

const updateSchema = z.object({
  nome: z.string().min(1).max(100).optional(),
  prezzo: z.number().positive().optional(),
  attivo: z.boolean().optional(),
});

export async function update(req: Request, res: Response) {
  const data = updateSchema.parse(req.body);
  const newspaper = await newspaperService.updateNewspaper(req.params.id, data);
  res.json({ newspaper });
}
