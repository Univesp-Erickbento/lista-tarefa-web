import { useState, type FormEvent } from "react";
import { criarTemplateNoCatalogo } from "../api/tarefas";
import type { TaskTemplate } from "../types";

interface Props {
  onCriado: (template: TaskTemplate) => void;
  onCancelar: () => void;
}

export function NewTaskTemplateModal({ onCriado, onCancelar }: Props) {
  const [tituloPadrao, setTituloPadrao] = useState("");
  const [descricaoPadrao, setDescricaoPadrao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [pontosPadrao, setPontosPadrao] = useState("10");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const template = await criarTemplateNoCatalogo({
        tituloPadrao,
        descricaoPadrao: descricaoPadrao || undefined,
        categoria: categoria || undefined,
        pontosPadrao: Number(pontosPadrao),
      });
      onCriado(template);
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem ?? "Não foi possível criar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

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
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Nova tarefa no catálogo</h3>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Título</label>
            <input
              value={tituloPadrao}
              onChange={(e) => setTituloPadrao(e.target.value)}
              placeholder="Ex: Arrumar a cama"
              required
            />
          </div>
          <div className="field">
            <label>Descrição (opcional)</label>
            <input value={descricaoPadrao} onChange={(e) => setDescricaoPadrao(e.target.value)} />
          </div>
          <div className="field">
            <label>Categoria (opcional)</label>
            <input
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ex: Casa, Estudo..."
            />
          </div>
          <div className="field">
            <label>Pontos padrão</label>
            <input
              type="number"
              min={1}
              value={pontosPadrao}
              onChange={(e) => setPontosPadrao(e.target.value)}
              required
            />
          </div>

          {erro && <p style={{ color: "var(--text-danger)", fontSize: 13 }}>{erro}</p>}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onCancelar}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
              disabled={enviando}
            >
              {enviando ? "Criando..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
