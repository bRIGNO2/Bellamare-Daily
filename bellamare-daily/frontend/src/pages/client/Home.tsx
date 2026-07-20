import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🗞️</div>
          <h1 className="text-2xl font-bold text-sea-900">Ciao {user?.nome}!</h1>
          <p className="text-lg text-sea-700 mt-1">Piazzola {user?.piazzola}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            to="/ordina"
            className="flex items-center gap-4 bg-sea-600 hover:bg-sea-700 text-white rounded-2xl px-6 py-6 text-2xl font-semibold shadow-sm transition active:scale-[0.98]"
          >
            <span className="text-3xl">🗞️</span> Ordina giornale
          </Link>
          <Link
            to="/ordini"
            className="flex items-center gap-4 bg-white hover:bg-sea-50 text-sea-800 border-2 border-sea-200 rounded-2xl px-6 py-6 text-2xl font-semibold shadow-sm transition active:scale-[0.98]"
          >
            <span className="text-3xl">📋</span> I miei ordini
          </Link>
          <Link
            to="/profilo"
            className="flex items-center gap-4 bg-white hover:bg-sea-50 text-sea-800 border-2 border-sea-200 rounded-2xl px-6 py-6 text-2xl font-semibold shadow-sm transition active:scale-[0.98]"
          >
            <span className="text-3xl">👤</span> Il mio profilo
          </Link>
        </div>
      </div>
    </div>
  );
}
