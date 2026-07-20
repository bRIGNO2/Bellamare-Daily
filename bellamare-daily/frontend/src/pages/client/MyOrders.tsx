import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../../components/Button";
import { Alert, Badge, Card, PageTitle, Spinner } from "../../components/ui";
import { ApiRequestError, api } from "../../lib/api";
import { Order as OrderType, STATUS_COLORS, STATUS_LABELS } from "../../lib/types";

function formatMoney(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

const CANCELLABLE_STATES = ["CREATED", "WAITING_PAYMENT"];

export default function MyOrders() {
  const location = useLocation();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<{ orders: OrderType[] }>("/orders/my");
      setOrders(res.orders);
    } catch {
      setError("Impossibile caricare gli ordini.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCancel(id: string) {
    setError(null);
    setCancelingId(id);
    try {
      await api.delete(`/orders/${id}`);
      await load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Impossibile annullare l'ordine.");
    } finally {
      setCancelingId(null);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-sea-700 text-lg mb-4 inline-block">
          ← Torna alla home
        </Link>
        <PageTitle>I miei ordini</PageTitle>

        {location.state?.justOrdered && (
          <Alert type="success">
            Ordine ricevuto! Passeremo in piazzola per ritirare il pagamento.
          </Alert>
        )}
        {error && <Alert>{error}</Alert>}

        {loading ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <Card>
            <p className="text-lg mb-4">Non hai ancora effettuato ordini.</p>
            <Link to="/ordina">
              <Button fullWidth>Ordina il tuo primo giornale</Button>
            </Link>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-lg font-semibold capitalize">{formatDate(order.dataConsegna)}</p>
                  <Badge className={STATUS_COLORS[order.stato]}>{STATUS_LABELS[order.stato]}</Badge>
                </div>
                <ul className="text-lg text-sea-700 mb-2">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.newspaper.nome} × {item.quantita}
                    </li>
                  ))}
                </ul>
                <p className="text-xl font-bold text-sea-900 mb-3">{formatMoney(Number(order.totale))}</p>
                {CANCELLABLE_STATES.includes(order.stato) && (
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={() => handleCancel(order.id)}
                    disabled={cancelingId === order.id}
                  >
                    {cancelingId === order.id ? "Annullamento..." : "Annulla ordine"}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
