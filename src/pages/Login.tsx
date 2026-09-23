import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/tarefas";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    try {
      const { token } = await login(email, senha);
      localStorage.setItem("token", token);
      navigate("/");
    } catch {
      setErro("E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 360, paddingTop: 80 }}>
      <h1 style={{ marginBottom: 20 }}>Lista de tarefas</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        {erro && <p style={{ color: "var(--text-danger)", fontSize: 13 }}>{erro}</p>}
        <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Entrar
        </button>
      </form>
    </div>
  );
}
