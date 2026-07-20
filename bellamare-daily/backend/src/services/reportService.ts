import { OrderStatus, PaymentStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { getTomorrowDate, normalizeDateOnly } from "../utils/cutoff";

function resolveDate(date?: string) {
  return date ? normalizeDateOnly(date) : getTomorrowDate();
}

const ACTIVE_STATES: OrderStatus[] = [
  OrderStatus.CREATED,
  OrderStatus.WAITING_PAYMENT,
  OrderStatus.PAID,
  OrderStatus.PREPARING,
  OrderStatus.DELIVERING,
];

/** Riepilogo dashboard per una data di consegna (default: domani). */
export async function getDashboardSummary(date?: string) {
  const targetDate = resolveDate(date);

  const orders = await prisma.order.findMany({
    where: { dataConsegna: targetDate, stato: { in: ACTIVE_STATES } },
    include: { items: { include: { newspaper: true } }, payment: true, user: true },
  });

  const copiePerGiornale = new Map<string, number>();
  let pagamentiMancanti = 0;
  let consegneDaEffettuare = 0;

  for (const order of orders) {
    if (order.payment?.stato === PaymentStatus.PENDING) pagamentiMancanti += 1;
    if (order.stato !== OrderStatus.COMPLETED && order.stato !== OrderStatus.CANCELLED) {
      consegneDaEffettuare += 1;
    }
    for (const item of order.items) {
      copiePerGiornale.set(
        item.newspaper.nome,
        (copiePerGiornale.get(item.newspaper.nome) || 0) + item.quantita
      );
    }
  }

  return {
    data: targetDate,
    numeroOrdini: orders.length,
    copiePerGiornale: Array.from(copiePerGiornale.entries()).map(([nome, copie]) => ({ nome, copie })),
    pagamentiMancanti,
    consegneDaEffettuare,
  };
}

/** Lista acquisto giornali aggregata per titolo (per il giornalaio). */
export async function getShoppingList(date?: string) {
  const targetDate = resolveDate(date);

  const items = await prisma.orderItem.findMany({
    where: {
      order: { dataConsegna: targetDate, stato: { in: ACTIVE_STATES } },
    },
    include: { newspaper: true },
  });

  const totals = new Map<string, number>();
  for (const item of items) {
    totals.set(item.newspaper.nome, (totals.get(item.newspaper.nome) || 0) + item.quantita);
  }

  return {
    data: targetDate,
    righe: Array.from(totals.entries())
      .map(([nome, copie]) => ({ nome, copie }))
      .sort((a, b) => a.nome.localeCompare(b.nome)),
  };
}

/** Lista di consegna ordinata per piazzola. */
export async function getDeliveryList(date?: string) {
  const targetDate = resolveDate(date);

  const orders = await prisma.order.findMany({
    where: {
      dataConsegna: targetDate,
      stato: { in: [OrderStatus.PAID, OrderStatus.PREPARING, OrderStatus.DELIVERING, OrderStatus.COMPLETED] },
    },
    include: { items: { include: { newspaper: true } }, user: true },
    orderBy: [{ user: { piazzola: "asc" } }],
  });

  return orders.map((order) => ({
    orderId: order.id,
    piazzola: order.user.piazzola,
    cliente: `${order.user.nome} ${order.user.cognome || ""}`.trim(),
    giornali: order.items.map((i) => `${i.newspaper.nome} x${i.quantita}`),
    stato: order.stato,
    consegnato: order.stato === OrderStatus.COMPLETED,
  }));
}

/** Segna un ordine come consegnato (PREPARING/DELIVERING → COMPLETED). */
export async function markOrderDelivered(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { stato: OrderStatus.COMPLETED },
  });
}

/** Riporta un ordine erroneamente segnato consegnato allo stato "in consegna". */
export async function markOrderNotDelivered(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { stato: OrderStatus.DELIVERING },
  });
}
