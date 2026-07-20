import { env } from "../config/env";

/**
 * Calcola il momento limite (deadline) entro cui è possibile
 * creare o annullare un ordine per una data di consegna.
 *
 * Regola: gli ordini per il giorno D si chiudono alle ORE_CUTOFF
 * del giorno D-1.
 */
export function getOrderDeadline(deliveryDate: Date): Date {
  const deadline = new Date(deliveryDate);
  deadline.setDate(deadline.getDate() - 1);
  deadline.setHours(env.orderCutoffHour, 0, 0, 0);
  return deadline;
}

/**
 * Ritorna true se, al momento della chiamata, è ancora possibile
 * creare/annullare un ordine per la data di consegna indicata.
 */
export function isBeforeCutoff(deliveryDate: Date, now: Date = new Date()): boolean {
  const deadline = getOrderDeadline(deliveryDate);
  return now.getTime() <= deadline.getTime();
}

/**
 * Ritorna la data di "domani" a mezzanotte (unica opzione di consegna in v1).
 */
export function getTomorrowDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Normalizza una data (rimuove componente oraria) per confronti/salvataggio.
 */
export function normalizeDateOnly(date: Date | string): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
