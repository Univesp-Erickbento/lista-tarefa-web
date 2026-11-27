import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { criarRamoFamilia, listarFamilia, listarFamilias } from "../api/tarefas";
import { NavHeader } from "../components/NavHeader";
import { NewTaskModal } from "../components/NewTaskModal";
import type { Family as FamilyType, User } from "../types";

export function Family() {
  const [membros, setMembros] = useState<User[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [atribuirA, setAtribuirA] = useState<User | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [familias, setFamilias] = useState<FamilyType[]>([]);
  const [novoRamoAberto, setNovoRamoAberto] = useState(false);
  const [nomeRamo, setNomeRamo] = useState("");
  const [enderecoRamo, setEnderecoRamo] = useState("");

  useEffect(() => {
    Promise.all([listarFamilia(), listarFamilias()])
      .then(([membrosDaFamilia, familiasDaConta]) => {
        setMembros(membrosDaFamilia);
        setFamilias(familiasDaConta);
      })
      .catch(() => setErro("Não foi possível carregar a família. Verifique se o backend está rodando."))
      .finally(() => setCarregando(false));
  }, []);

  async function criarRamo() {
    if (!nomeRamo.trim()) return;
    try {
      const ramo = await criarRamoFamilia({ nome: nomeRamo.trim(), endereco: enderecoRamo.trim() || undefined });
      setFamilias((atuais) => [...atuais, ramo]);
      setNomeRamo("");
      setEnderecoRamo("");
      setNovoRamoAberto(false);
      setAviso(`Ramo "${ramo.nome}" criado com o código ${ramo.codigoConvite}.`);
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem ?? "Não foi possível criar o ramo.");
    }
  }

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

        {familias.length > 0 && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Famílias e ramos</h3>
              <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => setNovoRamoAberto(true)}>
                + Novo ramo
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {familias.map((familia) => (
                <div key={familia.id} className="row-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: 14 }}>{familia.nome}</strong>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                      {familia.tipo === "PRINCIPAL" ? "Família principal" : "Ramo"}
                      {familia.endereco ? ` · ${familia.endereco}` : ""}
                    </p>
                  </div>
                  <span className="badge" style={{ background: "var(--bg-accent)", color: "var(--text-accent)" }}>
                    {familia.codigoConvite}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {novoRamoAberto && (
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginTop: 0 }}>Novo ramo da família</h3>
            <div className="field">
              <label>Nome do ramo</label>
              <input value={nomeRamo} onChange={(event) => setNomeRamo(event.target.value)} placeholder="Ex.: Família do Pai" />
            </div>
            <div className="field">
              <label>Endereço (opcional)</label>
              <input value={enderecoRamo} onChange={(event) => setEnderecoRamo(event.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-secondary" onClick={() => setNovoRamoAberto(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={criarRamo}>
                Criar ramo
              </button>
            </div>
          </div>
        )}
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
