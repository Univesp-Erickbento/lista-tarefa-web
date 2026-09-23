import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { avaliarTarefa, listarTarefas, ranking } from "../api/tarefas";
import { TaskCard } from "../components/TaskCard";
import { EvaluateModal } from "../components/EvaluateModal";
import { RankingPanel } from "../components/RankingPanel";
import type { Avaliacao, RankingEntry, Task } from "../types";

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rankingEntries, setRankingEntries] = useState<RankingEntry[]>([]);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<Task | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    const hoje = new Date().toISOString().slice(0, 10);
    const [tarefasDoDia, rankingDaSemana] = await Promise.all([
      listarTarefas({ data: hoje }),
      ranking("semana"),
    ]);
    setTasks(tarefasDoDia);
    setRankingEntries(rankingDaSemana);
    setCarregando(false);
  }

  async function confirmarAvaliacao(avaliacao: Avaliacao) {
    if (!tarefaSelecionada) return;
    await avaliarTarefa(tarefaSelecionada.id, avaliacao);
    setTarefaSelecionada(null);
    await carregar();
  }

  const concluidas = tasks.filter((t) => t.status === "CONCLUIDA").length;
  const atrasadas = tasks.filter((t) => t.status === "ATRASADA").length;
  const aguardandoAvaliacao = tasks.filter((t) => t.status === "CONCLUIDA" && !t.avaliacao).length;
  const pontosHoje = tasks.reduce((soma, t) => soma + (t.pontosGanhos ?? 0), 0);

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1>Lista de tarefas</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to="/catalogo" className="btn-secondary">
            Catálogo
          </Link>
          <Link to="/familia/novo" className="btn-primary">
            + Membro da família
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <div className="card">
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Tarefas hoje</p>
          <p style={{ fontSize: 24, fontWeight: 500 }}>{tasks.length}</p>
        </div>
        <div className="card">
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Aguardando avaliação</p>
          <p style={{ fontSize: 24, fontWeight: 500, color: "var(--text-warning)" }}>{aguardandoAvaliacao}</p>
        </div>
        <div className="card">
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Atrasadas</p>
          <p style={{ fontSize: 24, fontWeight: 500, color: "var(--text-danger)" }}>{atrasadas}</p>
        </div>
        <div className="card">
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Pontos hoje</p>
          <p style={{ fontSize: 24, fontWeight: 500, color: "var(--text-accent)" }}>{pontosHoje}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div>
          <h3>Tarefas de hoje</h3>
          {carregando && <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Carregando...</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onAvaliar={setTarefaSelecionada} />
            ))}
            {!carregando && tasks.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Nenhuma tarefa para hoje ainda.</p>
            )}
          </div>
        </div>

        <div>
          {concluidas > 0 && (
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16 }}>
              {concluidas} concluída(s) hoje
            </p>
          )}
          <RankingPanel entradas={rankingEntries} />
        </div>
      </div>

      {tarefaSelecionada && (
        <EvaluateModal
          task={tarefaSelecionada}
          onConfirmar={confirmarAvaliacao}
          onCancelar={() => setTarefaSelecionada(null)}
        />
      )}
    </div>
  );
}
