import { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { Card, Input, PageTitle, Spinner } from "../../components/ui";
import { api } from "../../lib/api";
import { Order } from "../../lib/types";
import AdminLayout from "./AdminLayout";

function formatMoney(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

export default function AdminPayments() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [markingId, setMarkingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await api.get<{ orders: Order[] }>("/admin/payments");
    setOrders(res.orders);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleMarkPaid(orderId: string) {
    setMarkingId(orderId);
    try {
      await api.post(`/admin/payments/${orderId}/mark-paid`);
      await load();
    } finally {
      setMarkingId(null);
    }
  }

  const filtered = orders.filter((o) =>
    search.trim() ? o.user?.piazzola.toLowerCase().includes(search.trim().toLowerCase()) : true
  );

  return (
    <AdminLayout>
      <PageTitle>Pagamenti da raccogliere</PageTitle>

      <div className="mb-6 max-w-xs">
        <Input placeholder="Cerca per piazzola..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-lg">Nessun pagamento in sospeso 🎉</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <Card key={order.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <p className="text-xl font-semibold">
                  Piazzola {order.user?.piazzola} — {order.user?.nome} {order.user?.cognome}
                </p>
                <p className="text-sea-700">
                  {order.items.map((i) => `${i.newspaper.nome} x${i.quantita}`).join(", ")}
                </p>
                <p className="text-lg font-bold text-sea-900 mt-1">{formatMoney(Number(order.totale))}</p>
              </div>
              <Button onClick={() => handleMarkPaid(order.id)} disabled={markingId === order.id}>
                {markingId === order.id ? "Registrazione..." : "Pagamento ricevuto"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
