import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../types";
import { normalizeDateOnly } from "../utils/cutoff";

export interface PaymentFilters {
  date?: string;
  piazzola?: string;
}

/** Elenco ordini con pagamento ancora da raccogliere. */
export async function listPendingPayments(filters: PaymentFilters) {
  return prisma.order.findMany({
    where: {
      stato: { in: [OrderStatus.CREATED, OrderStatus.WAITING_PAYMENT] },
      payment: { stato: PaymentStatus.PENDING },
      ...(filters.date ? { dataConsegna: normalizeDateOnly(filters.date) } : {}),
      ...(filters.piazzola ? { user: { piazzola: { contains: filters.piazzola } } } : {}),
    },
    include: { user: true, items: { include: { newspaper: true } }, payment: true },
    orderBy: [{ user: { piazzola: "asc" } }],
  });
}

export async function listPaymentHistory() {
  return prisma.payment.findMany({
    where: { stato: PaymentStatus.RECEIVED },
    include: { order: { include: { user: true } } },
    orderBy: { dataPagamento: "desc" },
    take: 200,
  });
}

/** Segna un pagamento come ricevuto e sblocca l'ordine (WAITING_PAYMENT → PAID). */
export async function markPaymentReceived(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
  if (!order || !order.payment) {
    throw new ApiError(404, "NOT_FOUND", "Ordine o pagamento non trovato.");
  }
  if (order.payment.stato === PaymentStatus.RECEIVED) {
    throw new ApiError(409, "ALREADY_PAID", "Il pagamento è già stato registrato.");
  }

  const [, updatedOrder] = await prisma.$transaction([
    prisma.payment.update({
      where: { orderId },
      data: { stato: PaymentStatus.RECEIVED, dataPagamento: new Date() },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { stato: OrderStatus.PAID },
    }),
  ]);

  return updatedOrder;
}
