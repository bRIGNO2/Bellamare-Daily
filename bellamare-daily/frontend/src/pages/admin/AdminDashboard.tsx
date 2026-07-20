import { useEffect, useState } from "react";
import { Card, PageTitle, Spinner } from "../../components/ui";
import { api } from "../../lib/api";
import AdminLayout from "./AdminLayout";

interface DashboardData {
  data: string;
  numeroOrdini: number;
  copiePerGiornale: { nome: string; copie: number }[];
  pagamentiMancanti: number;
  consegneDaEffettuare: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardData>("/admin/dashboard")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <PageTitle>Dashboard</PageTitle>
      {loading || !data ? (
        <Spinner />
      ) : (
        <>
          <p className="text-lg text-sea-700 mb-6 capitalize">Riepilogo per: {formatDate(data.data)}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <p className="text-sea-600 text-sm">Ordini totali</p>
              <p className="text-3xl font-bold text-sea-900">{data.numeroOrdini}</p>
            </Card>
            <Card>
              <p className="text-sea-600 text-sm">Pagamenti mancanti</p>
              <p className="text-3xl font-bold text-sun-600">{data.pagamentiMancanti}</p>
            </Card>
            <Card>
              <p className="text-sea-600 text-sm">Consegne da fare</p>
              <p className="text-3xl font-bold text-sea-700">{data.consegneDaEffettuare}</p>
            </Card>
            <Card>
              <p className="text-sea-600 text-sm">Titoli ordinati</p>
              <p className="text-3xl font-bold text-sea-900">{data.copiePerGiornale.length}</p>
            </Card>
          </div>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Copie da acquistare domani</h2>
            {data.copiePerGiornale.length === 0 ? (
              <p className="text-sea-600">Nessun ordine per la data selezionata.</p>
            ) : (
              <table className="w-full text-lg">
                <tbody>
                  {data.copiePerGiornale.map((row) => (
                    <tr key={row.nome} className="border-b border-sea-100 last:border-0">
                      <td className="py-2">{row.nome}</td>
                      <td className="py-2 text-right font-semibold">{row.copie} copie</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </AdminLayout>
  );
}
