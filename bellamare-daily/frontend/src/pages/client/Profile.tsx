import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/Button";
import { Alert, Card, Field, Input, PageTitle } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { ApiRequestError } from "../../lib/api";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [nome, setNome] = useState(user?.nome || "");
  const [cognome, setCognome] = useState(user?.cognome || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [piazzola, setPiazzola] = useState(user?.piazzola || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!nome.trim() || !piazzola.trim()) {
      setError("Nome e numero piazzola sono obbligatori.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ nome: nome.trim(), cognome: cognome.trim(), telefono: telefono.trim(), piazzola: piazzola.trim() });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <Link to="/" className="text-sea-700 text-lg mb-4 inline-block">
          ← Torna alla home
        </Link>
        <PageTitle>Il mio profilo</PageTitle>

        <Card>
          {error && <Alert>{error}</Alert>}
          {success && <Alert type="success">Profilo aggiornato con successo.</Alert>}
          <form onSubmit={handleSubmit}>
            <Field label="Nome *">
              <Input value={nome} onChange={(e) => setNome(e.target.value)} required />
            </Field>
            <Field label="Numero piazzola *">
              <Input value={piazzola} onChange={(e) => setPiazzola(e.target.value)} required />
            </Field>
            <Field label="Cognome">
              <Input value={cognome} onChange={(e) => setCognome(e.target.value)} />
            </Field>
            <Field label="Numero di telefono">
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} inputMode="tel" />
            </Field>
            <Button type="submit" fullWidth disabled={saving}>
              {saving ? "Salvataggio..." : "Salva modifiche"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
