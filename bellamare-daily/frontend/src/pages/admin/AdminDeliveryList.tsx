import { useEffect, useState } from "react";
import { Badge, Card, PageTitle, Spinner } from "../../components/ui";
import { api } from "../../lib/api";
import AdminLayout from "./AdminLayout";

interface DeliveryItem {
  orderId: string;
  piazzola: string;
  cliente: string;
  giornali: string[];
  stato: string;
  consegnato: boolean;
}

export default function AdminDeliveryList() {
  const [items, setItems] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await api.get<{ consegne: DeliveryItem[] }>("/admin/delivery-list");
    setItems(res.consegne);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleDelivered(item: DeliveryItem) {
    setUpdatingId(item.orderId);
    try {
      const path = item.consegnato
        ? `/admin/delivery/${item.orderId}/not-delivered`
        : `/admin/delivery/${item.orderId}/delivered`;
      await api.post(path);
      await load();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminLayout>
      <PageTitle>Lista di consegna</PageTitle>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Card>
          <p className="text-lg">Nessuna consegna programmata (ordini ancora da pagare non compaiono qui).</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card
              key={item.orderId}
              className={`flex items-center justify-between ${item.consegnato ? "opacity-60" : ""}`}
            >
              <div>
                <p className="text-xl font-bold text-sea-900">Piazzola {item.piazzola}</p>
                <p className="text-sea-700">{item.cliente}</p>
                <p className="text-lg mt-1">{item.giornali.join(" + ")}</p>
                {item.consegnato && (
                  <Badge className="bg-green-100 text-green-800 mt-2">Consegnato</Badge>
                )}
              </div>
              <button
                onClick={() => toggleDelivered(item)}
                disabled={updatingId === item.orderId}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 transition ${
                  item.consegnato
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-sea-300 text-sea-400"
                }`}
                aria-label={item.consegnato ? "Segna come non consegnato" : "Segna come consegnato"}
              >
                ✓
              </button>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
