import { Request, Response } from "express";
import * as reportService from "../services/reportService";

export async function dashboard(req: Request, res: Response) {
  const summary = await reportService.getDashboardSummary(req.query.date as string | undefined);
  res.json(summary);
}

export async function shoppingList(req: Request, res: Response) {
  const list = await reportService.getShoppingList(req.query.date as string | undefined);
  res.json(list);
}

export async function deliveryList(req: Request, res: Response) {
  const list = await reportService.getDeliveryList(req.query.date as string | undefined);
  res.json({ consegne: list });
}

export async function markDelivered(req: Request, res: Response) {
  const order = await reportService.markOrderDelivered(req.params.orderId);
  res.json({ order });
}

export async function markNotDelivered(req: Request, res: Response) {
  const order = await reportService.markOrderNotDelivered(req.params.orderId);
  res.json({ order });
}
