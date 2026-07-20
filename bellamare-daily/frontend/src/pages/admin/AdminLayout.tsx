import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/pagamenti", label: "Pagamenti", icon: "💶" },
  { to: "/admin/acquisti", label: "Lista acquisto", icon: "🛒" },
  { to: "/admin/consegne", label: "Consegne", icon: "🚚" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-sea-50 flex">
      <aside className="hidden md:flex flex-col w-64 bg-sea-900 text-white p-6">
        <div className="mb-8">
          <p className="text-xl font-bold">Bellamare Daily</p>
          <p className="text-sea-300 text-sm">Pannello amministratore</p>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-lg ${
                  isActive ? "bg-sea-700 font-semibold" : "hover:bg-sea-800"
                }`
              }
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 border-t border-sea-700">
          <p className="text-sea-300 text-sm mb-2">{admin?.username}</p>
          <button onClick={handleLogout} className="text-sea-300 hover:text-white text-sm underline">
            Esci
          </button>
        </div>
      </aside>

      {/* Nav mobile in alto */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-sea-900 text-white z-10 flex overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 text-center px-3 py-3 text-sm whitespace-nowrap ${isActive ? "bg-sea-700 font-semibold" : ""}`
            }
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </div>

      <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0 max-w-5xl">{children}</main>
    </div>
  );
}
