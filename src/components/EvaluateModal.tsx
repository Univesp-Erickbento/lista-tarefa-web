import { useState } from "react";
import type { Avaliacao, Task } from "../types";
import { AVALIACAO_INFO } from "../types";

interface Props {
  task: Task;
  onConfirmar: (avaliacao: Avaliacao) => void;
  onCancelar: () => void;
}

const OPCOES: Avaliacao[] = ["EXCELENTE", "BOM", "REGULAR", "INSUFICIENTE"];

export function EvaluateModal({ task, onConfirmar, onCancelar }: Props) {
  const [selecionada, setSelecionada] = useState<Avaliacao>("EXCELENTE");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div style={{ background: "var(--surface-1)", borderRadius: 16, padding: 20, width: 380 }}>
        <h3 style={{ fontSize: 16 }}>Avaliar tarefa</h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--text-secondary)" }}>
          {task.titulo} · {task.assignedTo.nome} · vale até {task.pontos} pts
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {OPCOES.map((opcao) => {
            const info = AVALIACAO_INFO[opcao];
            const pontosCalculados = Math.round((task.pontos * info.percentual) / 100 * 100) / 100;
            const ativa = selecionada === opcao;
            return (
              <label
                key={opcao}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "var(--surface-2)",
                  border: ativa ? "1.5px solid var(--text-primary)" : "0.5px solid var(--border)",
                  borderRadius: 10,
                  padding: 12,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="avaliacao"
                  checked={ativa}
                  onChange={() => setSelecionada(opcao)}
                  style={{ width: 16 }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{info.label}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)" }}>{info.descricao}</p>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {info.percentual}% · {pontosCalculados} pts
                </span>
              </label>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onCancelar}>
            Cancelar
          </button>
          <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => onConfirmar(selecionada)}>
            Confirmar avaliação
          </button>
        </div>
      </div>
    </div>
  );
}
