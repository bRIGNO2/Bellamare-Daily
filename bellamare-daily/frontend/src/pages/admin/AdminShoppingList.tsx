import { useEffect, useState } from "react";
import { Card, PageTitle, Spinner } from "../../components/ui";
import { api } from "../../lib/api";
import AdminLayout from "./AdminLayout";

interface ShoppingListData {
  data: string;
  righe: { nome: string; copie: number }[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

export default function AdminShoppingList() {
  const [data, setData] = useState<ShoppingListData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ShoppingListData>("/admin/shopping-list")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const totaleCopie = data?.righe.reduce((sum, r) => sum + r.copie, 0) || 0;

  return (
    <AdminLayout>
      <PageTitle>Lista acquisto giornali</PageTitle>
      {loading || !data ? (
        <Spinner />
      ) : (
        <>
          <p className="text-lg text-sea-700 mb-6 capitalize">Per: {formatDate(data.data)}</p>
          <Card>
            {data.righe.length === 0 ? (
              <p className="text-lg">Nessun ordine registrato per questa data.</p>
            ) : (
              <>
                <table className="w-full text-lg">
                  <thead>
                    <tr className="text-left border-b-2 border-sea-100">
                      <th className="py-2">Giornale</th>
                      <th className="py-2 text-right">Copie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.righe.map((row) => (
                      <tr key={row.nome} className="border-b border-sea-100 last:border-0">
                        <td className="py-3 text-xl">{row.nome}</td>
                        <td className="py-3 text-right text-xl font-bold">{row.copie}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between mt-4 pt-4 border-t-2 border-sea-200">
                  <span className="text-lg font-semibold">Totale copie</span>
                  <span className="text-xl font-bold">{totaleCopie}</span>
                </div>
              </>
            )}
          </Card>
          <p className="text-sea-500 text-sm mt-4">
            Suggerimento: usa la stampa del browser (Ctrl/Cmd + P) per portare questa lista dal giornalaio.
          </p>
        </>
      )}
    </AdminLayout>
  );
}
