import { useEffect, useState } from 'react';
import { fetchLcHistory } from '@/lib/lcHistory';
import type { LcHistoryEvent } from '@/types/models';

const ACTION_LABEL: Record<LcHistoryEvent['acao'], string> = {
  criado: 'Criado',
  editado: 'Editado',
  enviado_aprovacao: 'Enviado para aprovação',
  aprovado: 'Aprovado',
  reprovado: 'Reprovado',
  programacao_pcp: 'PCP',
};

export function LCHistoryTimeline({ lcId }: { lcId: string }) {
  const [items, setItems] = useState<LcHistoryEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void fetchLcHistory(lcId)
      .then((list) => {
        if (alive) setItems(list);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      alive = false;
    };
  }, [lcId]);

  return (
    <section className="rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-4">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
        Rastreabilidade
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Histórico de ações, responsáveis e revisões do desenho.
      </p>

      {error ? (
        <p className="mt-3 text-xs text-red-300">
          Não foi possível carregar o histórico: {error}
        </p>
      ) : null}

      {!error && items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Nenhum evento registrado ainda.</p>
      ) : null}

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border-l border-cyan-500/30 pl-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {ACTION_LABEL[item.acao]}
              </span>
              <span className="text-xs text-slate-600">
                {new Date(item.createdAt).toLocaleString('pt-BR')}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-300">{item.descricao}</p>
            <p className="mt-1 text-xs text-slate-500">
              Responsável: {item.responsavelNome}
              {item.responsavelPapel ? ` · ${item.responsavelPapel}` : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
