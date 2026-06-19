import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { fetchRecentLcHistory } from '@/lib/lcHistory';
import { useLCStore } from '@/store/lcStore';
import type { ControleLC, LcHistoryEvent, StatusAprovacao } from '@/types/models';

function countBy(items: ControleLC[], s: StatusAprovacao) {
  return items.filter((x) => x.statusAprovacao === s).length;
}

export function GerenciaDashboardPage() {
  const navigate = useNavigate();
  const items = useLCStore((s) => s.items);
  const [history, setHistory] = useState<LcHistoryEvent[]>([]);

  const stats = useMemo(() => {
    const programados = items.filter(
      (x) => x.statusAprovacao === 'aprovado' && x.programadoFabricacao
    ).length;
    return {
      total: items.length,
      rascunho: countBy(items, 'rascunho'),
      aguardando: countBy(items, 'aguardando_aprovacao'),
      aprovado: countBy(items, 'aprovado'),
      reprovado: countBy(items, 'reprovado'),
      programados,
    };
  }, [items]);

  const recent = useMemo(
    () => [...items].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 12),
    [items]
  );

  useEffect(() => {
    let alive = true;
    void fetchRecentLcHistory(10)
      .then((list) => {
        if (alive) setHistory(list);
      })
      .catch(() => {
        if (alive) setHistory([]);
      });
    return () => {
      alive = false;
    };
  }, [items]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Painel gerencial</h1>
      </div>

      <p className="mb-6 text-sm text-slate-400">
        Visão consolidada do fluxo de desenhos técnicos (status e programação).
      </p>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="Total" value={stats.total} />
        <Stat label="Rascunho" value={stats.rascunho} tone="muted" />
        <Stat label="Aguardando" value={stats.aguardando} tone="warn" />
        <Stat label="Aprovados" value={stats.aprovado} tone="ok" />
        <Stat label="Reprovados" value={stats.reprovado} tone="bad" />
        <Stat label="Prog. fabricação" value={stats.programados} tone="accent" />
      </div>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
        Registros recentes
      </h2>
      <div className="space-y-2">
        {recent.map((row) => (
          <Link
            key={row.id}
            to={`/lc/${row.id}`}
            className="flex items-center justify-between rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] px-4 py-3 transition hover:border-cyan-500/30"
          >
            <div>
              <span className="font-semibold text-cyan-300">OS {row.os}</span>
              <p className="text-xs text-slate-500">Rev. {row.revisao}</p>
            </div>
            <div className="flex items-center gap-2">
              {row.programadoFabricacao ? (
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300">
                  PCP
                </span>
              ) : null}
              <StatusBadge status={row.statusAprovacao} />
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-sm font-bold uppercase tracking-wider text-slate-500">
        Últimas ações rastreadas
      </h2>
      <div className="space-y-2">
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhuma ação registrada ainda.</p>
        ) : (
          history.map((event) => (
            <Link
              key={event.id}
              to={`/lc/${event.lcId}`}
              className="block rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] px-4 py-3 transition hover:border-cyan-500/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-cyan-300">OS {event.os}</span>
                <span className="text-xs text-slate-600">
                  {new Date(event.createdAt).toLocaleString('pt-BR')}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">{event.descricao}</p>
              <p className="mt-1 text-xs text-slate-500">
                Responsável: {event.responsavelNome}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'muted' | 'warn' | 'ok' | 'bad' | 'accent';
}) {
  const ring =
    tone === 'warn'
      ? 'border-amber-500/20'
      : tone === 'ok'
        ? 'border-emerald-500/20'
        : tone === 'bad'
          ? 'border-red-500/20'
          : tone === 'accent'
            ? 'border-cyan-500/20'
            : 'border-[var(--color-tisige-border)]';
  return (
    <div className={`rounded-2xl border ${ring} bg-[var(--color-tisige-elevated)] p-4`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
