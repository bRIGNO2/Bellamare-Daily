import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Alert, Card, Field, Input } from "../../components/ui";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { ApiRequestError } from "../../lib/api";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Errore di accesso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sea-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6 text-white">
          <p className="text-3xl mb-1">🗞️</p>
          <h1 className="text-2xl font-bold">Bellamare Daily</h1>
          <p className="text-sea-300">Accesso amministratore</p>
        </div>
        <Card>
          {error && <Alert>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <Field label="Nome utente">
              <Input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
            </Field>
            <Field label="Password">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
