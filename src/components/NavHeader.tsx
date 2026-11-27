import { Link, useLocation, useNavigate } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/familia", label: "Família" },
];

export function NavHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  function estaAtivo(to: string) {
    return to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 32px",
        borderBottom: "0.5px solid var(--border)",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <strong style={{ fontSize: 14 }}>Lista de tarefas</strong>
        {LINKS.map((link) => {
          const ativo = estaAtivo(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontSize: 13,
                color: ativo ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: ativo ? 600 : 400,
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <button className="btn-secondary" onClick={sair} style={{ fontSize: 13 }}>
        Sair
      </button>
    </div>
  );
}
