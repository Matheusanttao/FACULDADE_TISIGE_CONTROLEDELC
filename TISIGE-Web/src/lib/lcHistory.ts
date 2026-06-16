import type {
  ControleLC,
  LcHistoryAction,
  LcHistoryEvent,
  PapelUsuario,
} from '@/types/models';
import { supabase } from '@/lib/supabase';
import { resolvePapel } from '@/auth/permissions';
import { useAuthStore } from '@/store/authStore';

type LcHistoryRow = {
  id: string;
  lc_id: string;
  os: string;
  acao: LcHistoryAction;
  descricao: string;
  responsavel_nome: string | null;
  responsavel_papel: PapelUsuario | null;
  created_at: string;
};

const HISTORY_SELECT = `
  id,
  lc_id,
  os,
  acao,
  descricao,
  responsavel_nome,
  responsavel_papel,
  created_at
`;

function rowToHistory(row: LcHistoryRow): LcHistoryEvent {
  return {
    id: row.id,
    lcId: row.lc_id,
    os: row.os,
    acao: row.acao,
    descricao: row.descricao,
    responsavelNome: row.responsavel_nome ?? 'Sistema',
    responsavelPapel: row.responsavel_papel ?? undefined,
    createdAt: row.created_at,
  };
}

export async function fetchLcHistory(lcId: string): Promise<LcHistoryEvent[]> {
  const { data, error } = await supabase
    .from('controle_lc_historico')
    .select(HISTORY_SELECT)
    .eq('lc_id', lcId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as LcHistoryRow[]).map(rowToHistory);
}

export async function fetchRecentLcHistory(limit = 12): Promise<LcHistoryEvent[]> {
  const { data, error } = await supabase
    .from('controle_lc_historico')
    .select(HISTORY_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return ((data ?? []) as LcHistoryRow[]).map(rowToHistory);
}

export async function recordLcHistory(
  lc: Pick<ControleLC, 'id' | 'os'>,
  acao: LcHistoryAction,
  descricao: string
): Promise<void> {
  const user = useAuthStore.getState().user;
  const { error } = await supabase.from('controle_lc_historico').insert({
    lc_id: lc.id,
    os: lc.os,
    acao,
    descricao,
    responsavel_id: user?.id ?? null,
    responsavel_nome: user?.nome ?? user?.email ?? 'Sistema',
    responsavel_papel: user ? resolvePapel(user) : null,
  });

  if (error && import.meta.env.DEV) {
    console.warn('[TISIGE] histórico LC:', error.message);
  }
}
