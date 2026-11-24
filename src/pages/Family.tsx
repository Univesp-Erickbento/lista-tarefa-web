import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarFamilia } from "../api/tarefas";
import { NavHeader } from "../components/NavHeader";
import { NewTaskModal } from "../components/NewTaskModal";
import type { User } from "../types";

export function Family() {
  const [membros, setMembros] = useState<User[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atribuirA, setAtribuirA] = useState<User | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    listarFamilia()
      .then(setMembros)
      .catch(() => setErro("Não foi possível carregar a família. Verifique se o backend está rodando."))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div>
      <NavHeader />
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1>Família</h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
              {membros.length} {membros.length === 1 ? "pessoa cadastrada" : "pessoas cadastradas"}
            </p>
          </div>
          <Link to="/familia/novo" className="btn-primary">
            + Adicionar membro
          </Link>
        </div>

        {aviso && (
          <p
            style={{
              fontSize: 13,
              background: "var(--bg-success)",
              color: "var(--text-success)",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {aviso}
          </p>
        )}

        {carregando && <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Carregando...</p>}
        {erro && <p style={{ fontSize: 13, color: "var(--text-danger)" }}>{erro}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {membros.map((m) => (
            <div key={m.id} className="row-card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="avatar" style={{ background: "var(--bg-accent)", color: "var(--text-accent)" }}>
                {m.nome.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{m.nome}</p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
                  {m.grauParentesco}
                  {m.email ? ` · ${m.email}` : " · sem e-mail"}
                </p>
              </div>

              <span
                className="badge"
                style={
                  m.podeGerenciarTarefas
                    ? { background: "var(--bg-accent)", color: "var(--text-accent)" }
                    : { background: "var(--bg-pro)", color: "var(--text-pro)" }
                }
              >
                {m.podeGerenciarTarefas ? "Administrador" : "Membro"}
              </span>

              <button className="btn-secondary" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setAtribuirA(m)}>
                Atribuir tarefa
              </button>
            </div>
          ))}

          {!carregando && !erro && membros.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Nenhum membro cadastrado ainda.</p>
          )}
        </div>
      </div>

      {atribuirA && (
        <NewTaskModal
          assignedToIdInicial={atribuirA.id}
          onCancelar={() => setAtribuirA(null)}
          onCriada={(task) => {
            setAtribuirA(null);
            setAviso(
              `Tarefa "${task.titulo}" atribuída a ${task.assignedTo.nome} para ` +
                new Date(task.horario).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) +
                ". Veja na tela Início."
            );
            setTimeout(() => setAviso(null), 8000);
          }}
        />
      )}
    </div>
  );
}
