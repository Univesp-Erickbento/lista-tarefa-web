import type { Task } from "../types";
import { AVALIACAO_INFO } from "../types";

const STATUS_BADGE: Record<Task["status"], { bg: string; color: string; label: string }> = {
  PENDENTE: { bg: "var(--bg-amber)", color: "var(--text-warning)", label: "Pendente" },
  EM_ANDAMENTO: { bg: "var(--bg-accent)", color: "var(--text-accent)", label: "Em andamento" },
  CONCLUIDA: { bg: "var(--bg-success)", color: "var(--text-success)", label: "Concluída" },
  ATRASADA: { bg: "var(--bg-danger)", color: "var(--text-danger)", label: "Atrasada" },
};

interface Props {
  task: Task;
  onAvaliar?: (task: Task) => void;
}

export function TaskCard({ task, onAvaliar }: Props) {
  const aguardandoAvaliacao = task.status === "CONCLUIDA" && !task.avaliacao;
  const statusInfo = STATUS_BADGE[task.status];
  const iniciais = task.assignedTo.nome.charAt(0).toUpperCase();

  return (
    <div className="row-card">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="avatar" style={{ background: "var(--bg-accent)", color: "var(--text-accent)" }}>
          {iniciais}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{task.titulo}</p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>
            {task.assignedTo.nome} · {new Date(task.horario).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            {" · criada por "}
            {task.createdBy.nome} ({task.createdBy.grauParentesco})
          </p>
        </div>
        <span
          className="badge"
          style={{
            background: task.pontosGanhos != null ? "var(--bg-success)" : "var(--bg-amber)",
            color: task.pontosGanhos != null ? "var(--text-success)" : "var(--text-warning)",
          }}
        >
          {task.pontosGanhos != null ? `${task.pontosGanhos}/${task.pontos} pts` : `até ${task.pontos} pts`}
        </span>
        <span className="badge" style={{ background: statusInfo.bg, color: statusInfo.color }}>
          {statusInfo.label}
        </span>
      </div>

      {task.avaliacao && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid var(--border)", fontSize: 12, color: "var(--text-secondary)" }}>
          Avaliação: <strong style={{ color: "var(--text-primary)" }}>{AVALIACAO_INFO[task.avaliacao].label}</strong>
        </div>
      )}

      {aguardandoAvaliacao && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "0.5px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text-warning)", fontWeight: 500 }}>Aguardando sua avaliação</span>
          <button className="btn-primary" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => onAvaliar?.(task)}>
            Avaliar
          </button>
        </div>
      )}
    </div>
  );
}
