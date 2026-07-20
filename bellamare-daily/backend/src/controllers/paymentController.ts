import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";

export async function listPending(req: Request, res: Response) {
  const { date, piazzola } = req.query as { date?: string; piazzola?: string };
  const orders = await paymentService.listPendingPayments({ date, piazzola });
  res.json({ orders });
}

export async function history(_req: Request, res: Response) {
  const payments = await paymentService.listPaymentHistory();
  res.json({ payments });
}

export async function markPaid(req: Request, res: Response) {
  const order = await paymentService.markPaymentReceived(req.params.orderId);
  res.json({ order });
}
