/** A = acesso completo | B = somente visualização */
export type UserRole = 'A' | 'B';

export type PapelUsuario =
  | 'admin'
  | 'desenhista'
  | 'aprovador'
  | 'pcp'
  | 'gerencia'
  | 'visualizador';

export interface User {
  id?: string;
  username: string;
  nome: string;
  email: string;
  setor: string;
  tipo: UserRole;
  papel?: PapelUsuario;
}

export type StatusAprovacao =
  | 'rascunho'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'reprovado';

export interface ControleLC {
  id: string;
  arquivo: string;
  revisao: number;
  os: string;
  cliente: string;
  equipamento: string;
  dtContratual: string;
  dtRecebimento: string;
  dtRetirada?: string;
  respRetirada: string;
  setor: string;
  gaveta?: string;
  dataLimiteTestes?: string;
  gestaoFinalizado?: boolean;
  statusAprovacao: StatusAprovacao;
  motivoReprovacao?: string;
  aprovadoEm?: string;
  reprovadoEm?: string;
  aprovadorNome?: string;
  programadoFabricacao: boolean;
  programadoFabricacaoEm?: string;
  pcpNome?: string;
  enviadoAprovacaoEm?: string;
  criadoPorNome?: string;
  updatedAt?: string;
}

export type LcHistoryAction =
  | 'criado'
  | 'editado'
  | 'enviado_aprovacao'
  | 'aprovado'
  | 'reprovado'
  | 'programacao_pcp';

export interface LcHistoryEvent {
  id: string;
  lcId: string;
  os: string;
  acao: LcHistoryAction;
  descricao: string;
  responsavelNome: string;
  responsavelPapel?: PapelUsuario;
  createdAt: string;
}

export const SETORES = [
  'Barra',
  'Fio Redondo',
  'Mecânica',
  'Polo',
  'Teste',
] as const;
