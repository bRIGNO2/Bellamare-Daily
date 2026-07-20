import { OrderStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { ApiError } from "../types";
import { isBeforeCutoff, normalizeDateOnly } from "../utils/cutoff";

export interface OrderItemInput {
  newspaperId: string;
  quantita: number;
}

export interface CreateOrderInput {
  userId: string;
  dataConsegna: string; // ISO date
  items: OrderItemInput[];
}

/**
 * Crea un nuovo ordine applicando:
 * - validazione disponibilità dei giornali
 * - calcolo del totale a partire dal prezzo corrente (storicizzato in OrderItem)
 * - verifica del cutoff orario (regola business critica)
 * - creazione automatica del record Payment collegato (stato PENDING)
 */
export async function createOrder(input: CreateOrderInput) {
  if (!input.items.length) {
    throw new ApiError(400, "EMPTY_ORDER", "Seleziona almeno un giornale.");
  }

  const dataConsegna = normalizeDateOnly(input.dataConsegna);

  if (!isBeforeCutoff(dataConsegna)) {
    throw new ApiError(
      409,
      "ORDER_CUTOFF_PASSED",
      "Non è più possibile ordinare per questa data. Il termine è le 19:00 del giorno precedente."
    );
  }

  const newspaperIds = input.items.map((i) => i.newspaperId);
  const newspapers = await prisma.newspaper.findMany({ where: { id: { in: newspaperIds } } });

  const newspaperMap = new Map(newspapers.map((n) => [n.id, n]));

  let totale = 0;
  const itemsData = input.items.map((item) => {
    const newspaper = newspaperMap.get(item.newspaperId);
    if (!newspaper || !newspaper.attivo) {
      throw new ApiError(400, "NEWSPAPER_UNAVAILABLE", "Uno dei giornali selezionati non è disponibile.");
    }
    if (item.quantita < 1) {
      throw new ApiError(400, "INVALID_QUANTITY", "La quantità deve essere almeno 1.");
    }
    const prezzoUnitario = Number(newspaper.prezzo);
    totale += prezzoUnitario * item.quantita;
    return {
      newspaperId: newspaper.id,
      quantita: item.quantita,
      prezzoUnitario,
    };
  });

  const order = await prisma.order.create({
    data: {
      userId: input.userId,
      dataConsegna,
      stato: OrderStatus.WAITING_PAYMENT,
      totale,
      items: { create: itemsData },
      payment: { create: { importo: totale } },
    },
    include: { items: { include: { newspaper: true } }, payment: true },
  });

  return order;
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { newspaper: true } }, payment: true },
  });
}

export async function getOrderById(orderId: string, userId?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { newspaper: true } }, payment: true, user: true },
  });
  if (!order) {
    throw new ApiError(404, "NOT_FOUND", "Ordine non trovato.");
  }
  if (userId && order.userId !== userId) {
    throw new ApiError(404, "NOT_FOUND", "Ordine non trovato.");
  }
  return order;
}

export async function cancelOrder(orderId: string, userId: string) {
  const order = await getOrderById(orderId, userId);

  if (![OrderStatus.CREATED, OrderStatus.WAITING_PAYMENT].includes(order.stato)) {
    throw new ApiError(409, "CANNOT_CANCEL", "Questo ordine non può più essere annullato.");
  }

  if (!isBeforeCutoff(order.dataConsegna)) {
    throw new ApiError(
      409,
      "ORDER_CUTOFF_PASSED",
      "Non è più possibile annullare l'ordine. Il termine è le 19:00 del giorno precedente."
    );
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { stato: OrderStatus.CANCELLED },
  });
}

export async function updateOrderStatus(orderId: string, stato: OrderStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new ApiError(404, "NOT_FOUND", "Ordine non trovato.");
  }

  if (stato === OrderStatus.PREPARING && order.stato !== OrderStatus.PAID) {
    throw new ApiError(409, "INVALID_STATE_TRANSITION", "Solo gli ordini pagati possono essere messi in preparazione.");
  }

  return prisma.order.update({ where: { id: orderId }, data: { stato } });
}

export interface AdminOrderFilters {
  date?: string;
  stato?: OrderStatus;
  piazzola?: string;
}

export async function listOrdersForAdmin(filters: AdminOrderFilters) {
  return prisma.order.findMany({
    where: {
      ...(filters.date ? { dataConsegna: normalizeDateOnly(filters.date) } : {}),
      ...(filters.stato ? { stato: filters.stato } : {}),
      ...(filters.piazzola ? { user: { piazzola: { contains: filters.piazzola } } } : {}),
    },
    include: { items: { include: { newspaper: true } }, payment: true, user: true },
    orderBy: [{ user: { piazzola: "asc" } }],
  });
}
