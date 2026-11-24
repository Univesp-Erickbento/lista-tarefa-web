import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { criarTarefa, listarCatalogo, listarFamilia } from "../api/tarefas";
import type { Task, TaskTemplate, User } from "../types";

interface Props {
  templateIdInicial?: string;
  assignedToIdInicial?: string;
  onCriada: (task: Task) => void;
  onCancelar: () => void;
}

function agoraParaInput(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function NewTaskModal({ templateIdInicial, assignedToIdInicial, onCriada, onCancelar }: Props) {
  const [catalogo, setCatalogo] = useState<TaskTemplate[]>([]);
  const [familia, setFamilia] = useState<User[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [templateId, setTemplateId] = useState(templateIdInicial ?? "");
  const [assignedToId, setAssignedToId] = useState(assignedToIdInicial ?? "");
  const [horario, setHorario] = useState(agoraParaInput());
  const [pontos, setPontos] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resultadoCatalogo, resultadoFamilia] = await Promise.allSettled([
          listarCatalogo(),
          listarFamilia(),
        ]);

        if (resultadoCatalogo.status === "fulfilled") {
          setCatalogo(resultadoCatalogo.value);
          if (templateIdInicial) {
            const template = resultadoCatalogo.value.find((item) => item.id === templateIdInicial);
            if (template) setPontos(String(template.pontosPadrao));
          }
        }

        if (resultadoFamilia.status === "fulfilled") {
          setFamilia(resultadoFamilia.value);
        }

        if (resultadoCatalogo.status === "rejected" && resultadoFamilia.status === "rejected") {
          setErro("Não foi possível carregar o catálogo e a família.");
        } else if (resultadoCatalogo.status === "rejected") {
          setErro("Não foi possível carregar o catálogo.");
        } else if (resultadoFamilia.status === "rejected") {
          setErro("Não foi possível carregar a família.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [templateIdInicial]);

  function escolherTemplate(id: string) {
    setTemplateId(id);
    const template = catalogo.find((item) => item.id === id);
    if (template) setPontos(String(template.pontosPadrao));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const task = await criarTarefa({
        taskTemplateId: templateId,
        assignedToId,
        horario: new Date(horario).toISOString(),
        pontos: Number(pontos),
      });
      onCriada(task);
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem ?? "Não foi possível criar a tarefa. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: "var(--surface-1)", borderRadius: 16, padding: 20, width: 400, maxHeight: "90vh", overflowY: "auto" }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Nova tarefa</h3>

        {carregando && <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Carregando...</p>}

        {!carregando && catalogo.length === 0 && (
          <div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              O catálogo está vazio. <Link to="/catalogo" onClick={onCancelar}>Crie um item no catálogo</Link> primeiro.
            </p>
            <button className="btn-secondary" style={{ marginTop: 12 }} onClick={onCancelar}>Fechar</button>
          </div>
        )}

        {!carregando && catalogo.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Tarefa do catálogo</label>
              <select value={templateId} onChange={(event) => escolherTemplate(event.target.value)} required>
                <option value="" disabled>Selecione...</option>
                {catalogo.map((template) => (
                  <option key={template.id} value={template.id}>{template.tituloPadrao} ({template.pontosPadrao} pts)</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Quem vai fazer</label>
              <select value={assignedToId} onChange={(event) => setAssignedToId(event.target.value)} required>
                <option value="" disabled>Selecione...</option>
                {familia.map((membro) => (
                  <option key={membro.id} value={membro.id}>{membro.nome} ({membro.grauParentesco})</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Data e hora</label>
              <input type="datetime-local" value={horario} onChange={(event) => setHorario(event.target.value)} required />
            </div>

            <div className="field">
              <label>Pontos (valor cheio da tarefa)</label>
              <input type="number" min={1} value={pontos} onChange={(event) => setPontos(event.target.value)} required />
            </div>

            {erro && <p style={{ color: "var(--text-danger)", fontSize: 13 }}>{erro}</p>}

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onCancelar}>Cancelar</button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={enviando}>
                {enviando ? "Criando..." : "Criar tarefa"}
              </button>
            </div>
          </form>
        )}

        {!carregando && catalogo.length === 0 && erro && <p style={{ color: "var(--text-danger)", fontSize: 13, marginTop: 8 }}>{erro}</p>}
      </div>
    </div>
  );
}
