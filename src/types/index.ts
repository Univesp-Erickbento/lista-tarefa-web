// Tipos alinhados ao schema Postgres (db.changelog-lista-tarefas.sql)

export type GrauCategoria = "DIRETO" | "AFINIDADE" | "SOCIOAFETIVO";

export interface GrauParentesco {
  id: number;
  nome: string;
  categoria: GrauCategoria;
}

export interface User {
  id: string;
  nome: string;
  email?: string;
  grauParentesco: string; // ex: "Pai", "Avó", "Amigo(a) da família"
  podeGerenciarTarefas: boolean;
}

export interface Family {
  id: string;
  nome: string;
  endereco?: string;
  codigoConvite: string;
  tipo: "PRINCIPAL" | "RAMO";
  parentFamilyId?: string;
  createdAt: string;
}

export type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "ATRASADA";

export type Avaliacao = "EXCELENTE" | "BOM" | "REGULAR" | "INSUFICIENTE";

export const AVALIACAO_INFO: Record<
  Avaliacao,
  { label: string; descricao: string; percentual: number }
> = {
  EXCELENTE: { label: "Excelente", descricao: "Executou com dedicação e capricho", percentual: 100 },
  BOM: { label: "Bom", descricao: "Fez o melhor que pôde", percentual: 75 },
  REGULAR: { label: "Regular", descricao: "Fez de qualquer jeito", percentual: 40 },
  INSUFICIENTE: { label: "Insuficiente", descricao: "Fez só por fazer", percentual: 10 },
};

export interface TaskTemplate {
  id: string;
  tituloPadrao: string;
  descricaoPadrao?: string;
  categoria?: string;
  pontosPadrao: number;
  ativo: boolean;
}

export interface Task {
  id: string;
  taskTemplateId: string;
  titulo: string;
  descricao?: string;
  horario: string; // ISO datetime
  status: TaskStatus;
  pontos: number;
  avaliacao?: Avaliacao;
  pontosGanhos?: number;
  assignedTo: User;
  createdBy: User;
  avaliadoPor?: User;
  avaliadoEm?: string;
  concluidaEm?: string;
}

export interface TemplateUserStats {
  taskTemplateId: string;
  userId: string;
  userNome: string;
  vezesExecutada: number;
  pontosAcumulados: number;
  mediaAvaliacao: number; // 1-4
}

export interface RankingEntry {
  user: User;
  pontosSemana: number;
  posicao: number;
}
