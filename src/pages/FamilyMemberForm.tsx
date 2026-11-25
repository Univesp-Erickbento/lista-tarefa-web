import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adicionarMembroFamilia, listarGrausParentesco } from "../api/tarefas";
import { NavHeader } from "../components/NavHeader";

interface Grau {
  id: number;
  nome: string;
  categoria: string;
}

const CATEGORIA_LABEL: Record<string, string> = {
  DIRETO: "Parentesco direto",
  AFINIDADE: "Parentesco por afinidade",
  SOCIOAFETIVO: "Civil / socioafetivo",
};

export function FamilyMemberForm() {
  const [graus, setGraus] = useState<Grau[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [grauId, setGrauId] = useState<number | "">("");
  const [podeGerenciar, setPodeGerenciar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    listarGrausParentesco()
      .then(setGraus)
      .catch(() => setErro("Não foi possível carregar os graus de parentesco."));
  }, []);

  const grausPorCategoria = graus.reduce<Record<string, Grau[]>>((acc, g) => {
    (acc[g.categoria] ??= []).push(g);
    return acc;
  }, {});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (grauId === "") return;
    setErro(null);
    setEnviando(true);
    try {
      await adicionarMembroFamilia({
        nome,
        email: email || undefined,
        grauParentescoId: grauId,
        podeGerenciarTarefas: podeGerenciar,
      });
      navigate("/familia");
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem ?? "Não foi possível adicionar o membro. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <NavHeader />
      <div className="container" style={{ maxWidth: 480 }}>
        <h1 style={{ marginBottom: 20 }}>Adicionar membro da família</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Nome completo</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Erick Bento" required />
          </div>

          <div className="field">
            <label>E-mail (opcional para filhos pequenos)</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field">
            <label>Grau de parentesco</label>
            <select value={grauId} onChange={(e) => setGrauId(Number(e.target.value))} required>
              <option value="" disabled>
                Selecione...
              </option>
              {Object.entries(grausPorCategoria).map(([categoria, itens]) => (
                <optgroup key={categoria} label={CATEGORIA_LABEL[categoria] ?? categoria}>
                  {itens.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nome}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Permissão</label>
            <select
              value={podeGerenciar ? "admin" : "executa"}
              onChange={(e) => setPodeGerenciar(e.target.value === "admin")}
            >
              <option value="admin">Pode gerenciar tarefas (administrador)</option>
              <option value="executa">Apenas executa tarefas</option>
            </select>
          </div>

          {erro && <p style={{ color: "var(--text-danger)", fontSize: 13 }}>{erro}</p>}

          <button type="submit" className="btn-primary" disabled={enviando}>
            {enviando ? "Adicionando..." : "Adicionar à família"}
          </button>
        </form>
      </div>
    </div>
  );
}
