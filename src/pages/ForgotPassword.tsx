import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { solicitarLinkDeSenha } from "../api/tarefas";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      const resposta = await solicitarLinkDeSenha(email);
      setMensagem(resposta.mensagem);
    } catch {
      // Mesmo em erro de rede, não damos detalhe que ajude a enumerar e-mails
      setMensagem("Se esse e-mail estiver cadastrado, você vai receber um link em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 360, paddingTop: 80 }}>
      <h1 style={{ marginBottom: 8, fontSize: 20 }}>Esqueceu ou ainda não tem senha?</h1>
      <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-secondary)" }}>
        Digite o e-mail cadastrado pela sua família e enviaremos um link para você definir a senha.
      </p>

      {mensagem ? (
        <p style={{ fontSize: 14, background: "var(--surface-1)", padding: 12, borderRadius: 8 }}>{mensagem}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={enviando}
          >
            {enviando ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      )}

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <Link to="/login" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
