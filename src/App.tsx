import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import { Catalog } from "./pages/Catalog";
import { FamilyMemberForm } from "./pages/FamilyMemberForm";
import { Family } from "./pages/Family";

function RotaProtegida({ children }: { children: React.ReactNode }) {
  const autenticado = Boolean(localStorage.getItem("token"));
  return autenticado ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          }
        />
        <Route
          path="/catalogo"
          element={
            <RotaProtegida>
              <Catalog />
            </RotaProtegida>
          }
        />
        <Route
          path="/familia"
          element={
            <RotaProtegida>
              <Family />
            </RotaProtegida>
          }
        />
        <Route
          path="/familia/novo"
          element={
            <RotaProtegida>
              <FamilyMemberForm />
            </RotaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
