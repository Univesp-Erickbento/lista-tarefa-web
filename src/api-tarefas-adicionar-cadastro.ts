// ============================================================================
// ADICIONAR esta função em src/api/tarefas.ts (junto das outras de
// autenticação, perto de `login`). Usa o mesmo `api` (axios) já importado
// no topo do arquivo.
// ============================================================================

export async function cadastrar(
  nome: string,
  email: string,
  senha: string
): Promise<{ token: string; user: any }> {
  const { data } = await api.post("/auth/cadastro", { nome, email, senha });
  return data;
}
