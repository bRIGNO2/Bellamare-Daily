import { OrderStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import * as orderService from "../services/orderService";

const createOrderSchema = z.object({
  dataConsegna: z.string().min(1),
  items: z
    .array(
      z.object({
        newspaperId: z.string().min(1),
        quantita: z.number().int().min(1),
      })
    )
    .min(1, "Seleziona almeno un giornale"),
});

export async function createOrder(req: Request, res: Response) {
  const data = createOrderSchema.parse(req.body);
  const order = await orderService.createOrder({ userId: req.userId!, ...data });
  res.status(201).json({ order });
}

export async function getMyOrders(req: Request, res: Response) {
  const orders = await orderService.getOrdersByUser(req.userId!);
  res.json({ orders });
}

export async function getOrder(req: Request, res: Response) {
  const order = await orderService.getOrderById(req.params.id, req.userId!);
  res.json({ order });
}

export async function cancelOrder(req: Request, res: Response) {
  const order = await orderService.cancelOrder(req.params.id, req.userId!);
  res.json({ order });
}

// --- Admin ---

const statusSchema = z.object({
  stato: z.nativeEnum(OrderStatus),
});

export async function listOrdersAdmin(req: Request, res: Response) {
  const { date, stato, piazzola } = req.query as { date?: string; stato?: OrderStatus; piazzola?: string };
  const orders = await orderService.listOrdersForAdmin({ date, stato, piazzola });
  res.json({ orders });
}

export async function updateOrderStatusAdmin(req: Request, res: Response) {
  const { stato } = statusSchema.parse(req.body);
  const order = await orderService.updateOrderStatus(req.params.id, stato);
  res.json({ order });
}
