import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastrar } from "../api/tarefas";

export function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [nomeFamilia, setNomeFamilia] = useState("");
  const [endereco, setEndereco] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (senha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setEnviando(true);
    try {
      const { token, user } = await cadastrar(nome, email, senha, nomeFamilia, endereco);
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(user));
      navigate("/");
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem ?? "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 360, paddingTop: 60 }}>
      <h1 style={{ marginBottom: 8 }}>Criar sua família</h1>
      <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-secondary)" }}>
        Você será o primeiro administrador — depois pode convidar o resto da família.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Nome da família</label>
          <input value={nomeFamilia} onChange={(e) => setNomeFamilia(e.target.value)} required placeholder="Ex.: Família Bento" />
        </div>
        <div className="field">
          <label>Endereço (opcional)</label>
          <input value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número, bairro" />
        </div>
        <div className="field">
          <label>Seu nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="field">
          <label>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        <div className="field">
          <label>Confirmar senha</label>
          <input type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} required />
        </div>
        {erro && <p style={{ color: "var(--text-danger)", fontSize: 13 }}>{erro}</p>}
        <button
          type="submit"
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={enviando}
        >
          {enviando ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Link to="/login" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Já tem conta? Entrar
        </Link>
      </div>
    </div>
  );
}
