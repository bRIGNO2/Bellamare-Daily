import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Alert, Card, Field, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { ApiRequestError } from "../../lib/api";

export default function Welcome() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [piazzola, setPiazzola] = useState("");
  const [cognome, setCognome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!nome.trim() || !piazzola.trim()) {
      setError("Nome e numero piazzola sono obbligatori.");
      return;
    }

    setLoading(true);
    try {
      await register({
        nome: nome.trim(),
        piazzola: piazzola.trim(),
        cognome: cognome.trim() || undefined,
        telefono: telefono.trim() || undefined,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Errore durante la registrazione.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🗞️</div>
          <h1 className="text-3xl font-bold text-sea-900">Bellamare Daily</h1>
          <p className="text-lg text-sea-700 mt-2">Ordina il tuo giornale, comodamente in piazzola</p>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Benvenuto! Iniziamo</h2>
          {error && <Alert>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Field label="Nome *">
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Es. Mario"
                autoFocus
                required
              />
            </Field>
            <Field label="Numero piazzola *">
              <Input
                value={piazzola}
                onChange={(e) => setPiazzola(e.target.value)}
                placeholder="Es. 42"
                inputMode="numeric"
                required
              />
            </Field>
            <Field label="Cognome (facoltativo)">
              <Input value={cognome} onChange={(e) => setCognome(e.target.value)} placeholder="Es. Rossi" />
            </Field>
            <Field label="Numero di telefono (facoltativo)">
              <Input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Es. 333 1234567"
                inputMode="tel"
              />
            </Field>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Attendere..." : "Inizia"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
