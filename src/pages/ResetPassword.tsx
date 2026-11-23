import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { redefinirSenha } from "../api/tarefas";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (novaSenha !== confirmacao) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setEnviando(true);
    try {
      await redefinirSenha(token, novaSenha);
      setSucesso(true);
    } catch (err: any) {
      setErro(err?.response?.data?.mensagem ?? "Não foi possível definir a senha. O link pode ter expirado.");
    } finally {
      setEnviando(false);
    }
  }

  if (!token) {
    return (
      <div className="container" style={{ maxWidth: 360, paddingTop: 80 }}>
        <p style={{ fontSize: 14, color: "var(--text-danger)" }}>
          Link inválido — falta o token. Solicite um novo link.
        </p>
        <Link to="/esqueci-senha" style={{ fontSize: 13 }}>
          Solicitar novo link
        </Link>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="container" style={{ maxWidth: 360, paddingTop: 80 }}>
        <p style={{ fontSize: 14, marginBottom: 16 }}>Senha definida com sucesso!</p>
        <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("/login")}>
          Ir para o login
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 360, paddingTop: 80 }}>
      <h1 style={{ marginBottom: 20, fontSize: 20 }}>Definir senha</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Nova senha</label>
          <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required />
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
          {enviando ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
