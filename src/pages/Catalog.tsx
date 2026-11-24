import { useEffect, useState } from "react";
import { estatisticasDoTemplate, listarCatalogo } from "../api/tarefas";
import { NavHeader } from "../components/NavHeader";
import { NewTaskTemplateModal } from "../components/NewTaskTemplateModal";
import { NewTaskModal } from "../components/NewTaskModal";
import type { TaskTemplate, TemplateUserStats } from "../types";

export function Catalog() {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [statsPorTemplate, setStatsPorTemplate] = useState<Record<string, TemplateUserStats[]>>({});
  const [modalAberto, setModalAberto] = useState(false);
  const [templateParaAtribuir, setTemplateParaAtribuir] = useState<TaskTemplate | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    listarCatalogo().then(setTemplates);
  }

  async function alternarExpandir(templateId: string) {
    if (expandido === templateId) {
      setExpandido(null);
      return;
    }
    setExpandido(templateId);
    if (!statsPorTemplate[templateId]) {
      const stats = await estatisticasDoTemplate(templateId);
      setStatsPorTemplate((prev) => ({ ...prev, [templateId]: stats }));
    }
  }

  function handleCriado(novo: TaskTemplate) {
    setTemplates((prev) => [...prev, novo]);
    setModalAberto(false);
    setAviso("Catálogo atualizado com sucesso!");
  }

  return (
    <div>
      <NavHeader />
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1>Catálogo de tarefas</h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
              Tipos de tarefa padronizados da família
            </p>
          </div>
          <button className="btn-primary" onClick={() => setModalAberto(true)}>
            + Nova tarefa no catálogo
          </button>
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

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {templates.map((template) => {
            const aberto = expandido === template.id;
            const stats = statsPorTemplate[template.id] ?? [];
            return (
              <div
                key={template.id}
                className="row-card"
                style={{ borderColor: aberto ? "var(--border-strong)" : undefined }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                  onClick={() => alternarExpandir(template.id)}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>{template.tituloPadrao}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
                      {template.categoria ?? "Sem categoria"} · {template.pontosPadrao} pts padrão
                    </p>
                  </div>
                  <span style={{ fontSize: 18, color: "var(--text-muted)" }}>{aberto ? "▲" : "▼"}</span>
                </div>

                <button
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: "5px 12px", marginTop: 10 }}
                  onClick={() => setTemplateParaAtribuir(template)}
                >
                  Atribuir tarefa
                </button>

                {aberto && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                    {stats.map((s) => (
                      <div
                        key={s.userId}
                        className="card"
                        style={{ background: "var(--surface-1)", display: "flex", alignItems: "center", gap: 10 }}
                      >
                        <div className="avatar" style={{ background: "var(--bg-accent)", color: "var(--text-accent)" }}>
                          {s.userNome.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{s.userNome}</p>
                          <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
                            {s.vezesExecutada} execuções · {s.pontosAcumulados} pts
                          </p>
                        </div>
                        <span style={{ fontSize: 12, color: "var(--text-warning)" }}>
                          ⭐ {s.mediaAvaliacao.toFixed(1)}
                        </span>
                      </div>
                    ))}
                    {stats.length === 0 && (
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", gridColumn: "1 / -1" }}>
                        Ninguém executou essa tarefa ainda.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {templates.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Catálogo vazio — clique em "+ Nova tarefa no catálogo" para começar.
            </p>
          )}
        </div>

        <div className="card" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
            Ao criar uma nova tarefa do dia, escolha um item deste catálogo — assim o histórico e a
            pontuação ficam consolidados no mesmo lugar, em vez de espalhados por nomes parecidos.
          </p>
        </div>
      </div>

      {modalAberto && (
        <NewTaskTemplateModal onCriado={handleCriado} onCancelar={() => setModalAberto(false)} />
      )}
      {templateParaAtribuir && (
        <NewTaskModal
          templateIdInicial={templateParaAtribuir.id}
          onCancelar={() => setTemplateParaAtribuir(null)}
          onCriada={(task) => {
            setTemplateParaAtribuir(null);
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
