export interface User {
  id: string;
  nome: string;
  cognome: string | null;
  telefono: string | null;
  piazzola: string;
  createdAt: string;
}

export interface Newspaper {
  id: string;
  nome: string;
  prezzo: string;
  attivo: boolean;
}

export type OrderStatus =
  | "CREATED"
  | "WAITING_PAYMENT"
  | "PAID"
  | "PREPARING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  quantita: number;
  prezzoUnitario: string;
  newspaper: Newspaper;
}

export interface Payment {
  id: string;
  importo: string;
  stato: "PENDING" | "RECEIVED";
  dataPagamento: string | null;
}

export interface Order {
  id: string;
  dataConsegna: string;
  stato: OrderStatus;
  totale: string;
  createdAt: string;
  items: OrderItem[];
  payment: Payment | null;
  user?: User;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  CREATED: "Creato",
  WAITING_PAYMENT: "In attesa di pagamento",
  PAID: "Pagato",
  PREPARING: "In preparazione",
  DELIVERING: "In consegna",
  COMPLETED: "Consegnato",
  CANCELLED: "Annullato",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  CREATED: "bg-gray-200 text-gray-800",
  WAITING_PAYMENT: "bg-sun-500 text-white",
  PAID: "bg-sea-500 text-white",
  PREPARING: "bg-sea-600 text-white",
  DELIVERING: "bg-sea-700 text-white",
  COMPLETED: "bg-green-600 text-white",
  CANCELLED: "bg-red-200 text-red-800",
};
