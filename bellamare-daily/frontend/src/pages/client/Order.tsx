import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Alert, Card, PageTitle, Spinner } from "../../components/ui";
import { ApiRequestError, api } from "../../lib/api";
import { Newspaper } from "../../lib/types";

function formatMoney(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR" });
}

function tomorrowLabel() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

export default function Order() {
  const navigate = useNavigate();
  const [newspapers, setNewspapers] = useState<Newspaper[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ newspapers: Newspaper[] }>("/newspapers")
      .then((res) => setNewspapers(res.newspapers))
      .catch(() => setError("Impossibile caricare i giornali disponibili."))
      .finally(() => setLoading(false));
  }, []);

  function updateQty(id: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  }

  const items = useMemo(
    () => newspapers.filter((n) => (quantities[n.id] || 0) > 0),
    [newspapers, quantities]
  );

  const totale = useMemo(
    () => items.reduce((sum, n) => sum + Number(n.prezzo) * (quantities[n.id] || 0), 0),
    [items, quantities]
  );

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dataConsegna = tomorrow.toISOString().slice(0, 10);

      await api.post("/orders", {
        dataConsegna,
        items: items.map((n) => ({ newspaperId: n.id, quantita: quantities[n.id] })),
      });
      navigate("/ordini", { state: { justOrdered: true } });
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : "Errore durante l'invio dell'ordine. Riprova."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen px-4 py-8 pb-32">
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-sea-700 text-lg mb-4 inline-block">
          ← Torna alla home
        </Link>
        <PageTitle>Ordina il tuo giornale</PageTitle>
        <p className="text-lg text-sea-700 mb-6 capitalize">Consegna: {tomorrowLabel()}</p>

        {error && <Alert>{error}</Alert>}

        {newspapers.length === 0 ? (
          <Card>
            <p className="text-lg">Nessun giornale disponibile al momento.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {newspapers.map((n) => (
              <Card key={n.id} className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold text-sea-900">{n.nome}</p>
                  <p className="text-lg text-sea-600">{formatMoney(Number(n.prezzo))}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(n.id, -1)}
                    aria-label={`Diminuisci quantità ${n.nome}`}
                    className="w-12 h-12 rounded-full bg-sea-100 text-sea-800 text-2xl font-bold flex items-center justify-center active:scale-95"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold w-8 text-center">{quantities[n.id] || 0}</span>
                  <button
                    onClick={() => updateQty(n.id, 1)}
                    aria-label={`Aumenta quantità ${n.nome}`}
                    className="w-12 h-12 rounded-full bg-sea-600 text-white text-2xl font-bold flex items-center justify-center active:scale-95"
                  >
                    +
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-sea-100 p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg text-sea-700">Totale</span>
              <span className="text-2xl font-bold text-sea-900">{formatMoney(totale)}</span>
            </div>
            <Button fullWidth onClick={handleConfirm} disabled={submitting}>
              {submitting ? "Invio in corso..." : "Conferma ordine"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
