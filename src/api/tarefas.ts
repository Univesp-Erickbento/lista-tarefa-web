import { api } from "./client";
import type { Task, TaskTemplate, TemplateUserStats, RankingEntry, Avaliacao, User, Family } from "../types";


export async function solicitarLinkDeSenha(email: string): Promise<{ mensagem: string }> {
  const { data } = await api.post("/auth/esqueci-senha", { email });
  return data;
}

export async function redefinirSenha(token: string, novaSenha: string): Promise<{ mensagem: string }> {
  const { data } = await api.post("/auth/redefinir-senha", { token, novaSenha });
  return data;
}

// ---- Autenticação ----
export async function login(email: string, senha: string): Promise<{ token: string; user: User }> {
  const { data } = await api.post("/auth/login", { email, senha });
  return data;
}

// ---- Tarefas do dia ----
export async function listarTarefas(params?: { data?: string; status?: string; assignedTo?: string }): Promise<Task[]> {
  const { data } = await api.get("/tasks", { params });
  return data;
}

export async function criarTarefa(payload: {
  taskTemplateId: string;
  horario: string;
  assignedToId: string;
  pontos: number;
}): Promise<Task> {
  const { data } = await api.post("/tasks", payload);
  return data;
}

export async function alterarTarefa(id: string, payload: Partial<Task>): Promise<Task> {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data;
}

export async function excluirTarefa(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function concluirTarefa(id: string): Promise<Task> {
  const { data } = await api.patch(`/tasks/${id}/concluir`);
  return data;
}

export async function avaliarTarefa(id: string, avaliacao: Avaliacao): Promise<Task> {
  const { data } = await api.patch(`/tasks/${id}/avaliar`, { avaliacao });
  return data;
}

// ---- Catálogo (TaskTemplate) ----
export async function listarCatalogo(): Promise<TaskTemplate[]> {
  const { data } = await api.get("/task-templates");
  return data;
}

export async function criarTemplateNoCatalogo(payload: {
  tituloPadrao: string;
  descricaoPadrao?: string;
  categoria?: string;
  pontosPadrao: number;
}): Promise<TaskTemplate> {
  const { data } = await api.post("/task-templates", payload);
  return data;
}

export async function estatisticasDoTemplate(templateId: string): Promise<TemplateUserStats[]> {
  const { data } = await api.get(`/task-templates/${templateId}/stats`);
  return data;
}

// ---- Ranking ----
export async function ranking(periodo: "semana" | "mes" = "semana"): Promise<RankingEntry[]> {
  const { data } = await api.get("/ranking", { params: { periodo } });
  return data;
}

// ---- Família ----
export async function listarFamilia(): Promise<User[]> {
  const { data } = await api.get("/users");
  return data;
}

export async function adicionarMembroFamilia(payload: {
  nome: string;
  email?: string;
  grauParentescoId: number;
  podeGerenciarTarefas: boolean;
}): Promise<User> {
  const { data } = await api.post("/users", payload);
  return data;
}

export async function listarGrausParentesco(): Promise<
  { id: number; nome: string; categoria: string }[]
> {
  const { data } = await api.get("/graus-parentesco");
  return data;
}

export async function cadastrar(
  nome: string,
  email: string,
  senha: string,
  nomeFamilia: string,
  endereco?: string
): Promise<{ token: string; user: any }> {
  const { data } = await api.post("/auth/cadastro", { nome, email, senha, nomeFamilia, endereco });
  return data;
}

export async function listarFamilias(): Promise<Family[]> {
  const { data } = await api.get("/families");
  return data;
}

export async function criarRamoFamilia(payload: { nome: string; endereco?: string }): Promise<Family> {
  const { data } = await api.post("/families", payload);
  return data;
}