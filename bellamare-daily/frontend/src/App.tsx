import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAdminAuth } from "./components/RequireAdminAuth";
import { RequireClientAuth } from "./components/RequireClientAuth";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDeliveryList from "./pages/admin/AdminDeliveryList";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminShoppingList from "./pages/admin/AdminShoppingList";
import Home from "./pages/client/Home";
import MyOrders from "./pages/client/MyOrders";
import Order from "./pages/client/Order";
import Profile from "./pages/client/Profile";
import Welcome from "./pages/client/Welcome";
import { Spinner } from "./components/ui";

function WelcomeOrRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to="/" replace />;
  return <Welcome />;
}

function ClientArea() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/benvenuto" element={<WelcomeOrRedirect />} />
        <Route
          path="/"
          element={
            <RequireClientAuth>
              <Home />
            </RequireClientAuth>
          }
        />
        <Route
          path="/ordina"
          element={
            <RequireClientAuth>
              <Order />
            </RequireClientAuth>
          }
        />
        <Route
          path="/ordini"
          element={
            <RequireClientAuth>
              <MyOrders />
            </RequireClientAuth>
          }
        />
        <Route
          path="/profilo"
          element={
            <RequireClientAuth>
              <Profile />
            </RequireClientAuth>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

function AdminArea() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route
          index
          element={
            <RequireAdminAuth>
              <AdminDashboard />
            </RequireAdminAuth>
          }
        />
        <Route
          path="pagamenti"
          element={
            <RequireAdminAuth>
              <AdminPayments />
            </RequireAdminAuth>
          }
        />
        <Route
          path="acquisti"
          element={
            <RequireAdminAuth>
              <AdminShoppingList />
            </RequireAdminAuth>
          }
        />
        <Route
          path="consegne"
          element={
            <RequireAdminAuth>
              <AdminDeliveryList />
            </RequireAdminAuth>
          }
        />
      </Routes>
    </AdminAuthProvider>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminArea />} />
      <Route path="/*" element={<ClientArea />} />
    </Routes>
  );
}
