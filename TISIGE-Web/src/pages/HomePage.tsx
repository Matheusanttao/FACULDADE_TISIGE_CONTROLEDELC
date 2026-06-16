import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Factory,
  Grid3X3,
  LayoutDashboard,
  PenLine,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';
import {
  canAccessPcpFabricacao,
  canApprove,
  canManageUsers,
  canViewGerenciaDashboard,
  resolvePapel,
} from '@/auth/permissions';
import { useAuthStore } from '@/store/authStore';
import { useLCStore } from '@/store/lcStore';
import type { PapelUsuario } from '@/types/models';

const PAPEL_LABEL: Record<PapelUsuario, string> = {
  admin: 'Admin',
  desenhista: 'Desenho',
  aprovador: 'Aprovação',
  pcp: 'PCP',
  gerencia: 'Gerência',
  visualizador: 'Leitura',
};

function Card({
  to,
  title,
  subtitle,
  icon: Icon,
  accent = '#22d3ee',
}: {
  to: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent?: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-5 transition hover:-translate-y-0.5 hover:border-white/15 hover:shadow-lg hover:shadow-black/20"
    >
      <div
        className="absolute -right-10 -top-10 size-28 rounded-full blur-2xl transition group-hover:opacity-60"
        style={{ backgroundColor: `${accent}22` }}
      />
      <div
        className="relative mb-4 flex size-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}18`, color: accent }}
      >
        <Icon className="size-5" />
      </div>
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-white group-hover:text-cyan-100">{title}</h3>
          <ArrowRight className="mt-0.5 size-4 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" />
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{subtitle}</p>
      </div>
    </Link>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-tisige-border)] bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <Icon className={`size-4 ${tone}`} />
      </div>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function NextStep({
  to,
  title,
  text,
  icon: Icon,
}: {
  to: string;
  title: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 transition hover:border-cyan-300/40 hover:bg-cyan-500/15"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-white">{title}</p>
        <p className="mt-0.5 text-sm text-cyan-100/70">{text}</p>
      </div>
      <ArrowRight className="size-5 text-cyan-300 transition group-hover:translate-x-1" />
    </Link>
  );
}

export function HomePage() {
  const user = useAuthStore((s) => s.user);
  const items = useLCStore((s) => s.items);
  const papel = resolvePapel(user);
  const showAprovacao = user ? canApprove(user) : false;
  const showPcp = user ? canAccessPcpFabricacao(user) : false;
  const showGerencia = user ? canViewGerenciaDashboard(user) : false;
  const showAdmin = user ? canManageUsers(user) : false;

  const stats = useMemo(() => {
    const aguardando = items.filter(
      (item) => item.statusAprovacao === 'aguardando_aprovacao'
    ).length;
    const aprovados = items.filter((item) => item.statusAprovacao === 'aprovado').length;
    const reprovados = items.filter((item) => item.statusAprovacao === 'reprovado').length;
    const programados = items.filter(
      (item) => item.statusAprovacao === 'aprovado' && item.programadoFabricacao
    ).length;

    return { total: items.length, aguardando, aprovados, reprovados, programados };
  }, [items]);

  const nextStep = useMemo(() => {
    if (showAprovacao) {
      return {
        to: '/aprovacao',
        title: 'Aprovações pendentes',
        text: `${stats.aguardando} LC(s) aguardando decisão técnica.`,
        icon: ShieldCheck,
      };
    }
    if (showPcp) {
      return {
        to: '/pcp-fabricacao',
        title: 'Programação PCP',
        text: `${stats.aprovados} LC(s) aprovada(s) disponíveis para fabricação.`,
        icon: Factory,
      };
    }
    if (showGerencia) {
      return {
        to: '/gerencia',
        title: 'Acompanhar fluxo',
        text: 'Veja indicadores, status e últimas ações rastreadas.',
        icon: LayoutDashboard,
      };
    }
    return {
      to: '/controle-lc',
      title: 'Controle de desenhos',
      text: 'Cadastre, consulte e acompanhe suas LCs.',
      icon: PenLine,
    };
  }, [showAprovacao, showGerencia, showPcp, stats.aguardando, stats.aprovados]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_34%),linear-gradient(135deg,rgba(26,36,51,0.95),rgba(10,14,20,0.92))] p-6 shadow-2xl shadow-black/20 md:p-8">
        <div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 md:block">
          TISIGE | Fluxo de desenhos técnicos
        </div>
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
            <Sparkles className="size-3.5" />
            Gestão integrada: Engenharia, Aprovação, PCP e Gerência
          </div>
          <p className="text-sm text-slate-400">Bem-vindo,</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white md:text-5xl">
            {user?.nome ?? 'Usuário'}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            Controle centralizado para cadastrar desenhos, validar revisões,
            registrar decisões técnicas e acompanhar a programação de fabricação.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Setor: {user?.setor ?? '—'}
            </span>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
              Perfil: {PAPEL_LABEL[papel]}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              {user?.tipo === 'A' ? 'Permissão de edição' : 'Somente leitura'}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Metric label="Total" value={stats.total} icon={ClipboardList} tone="text-cyan-300" />
          <Metric label="Aguardando" value={stats.aguardando} icon={Clock3} tone="text-amber-300" />
          <Metric label="Aprovadas" value={stats.aprovados} icon={CheckCircle2} tone="text-emerald-300" />
          <Metric label="Reprovadas" value={stats.reprovados} icon={XCircle} tone="text-red-300" />
          <Metric label="PCP" value={stats.programados} icon={Factory} tone="text-cyan-300" />
        </div>
        <NextStep {...nextStep} />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Módulos do sistema
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              Acesse o fluxo conforme seu perfil
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card
            to="/controle-lc"
            title="Controle de LC"
            subtitle="Cadastro, consulta, revisão e detalhes dos desenhos técnicos."
            icon={ClipboardList}
          />
          {showAprovacao ? (
            <Card
              to="/aprovacao"
              title="Aprovação técnica"
              subtitle="Fila de LCs aguardando análise, aprovação ou reprovação."
              icon={ShieldCheck}
              accent="#fbbf24"
            />
          ) : null}
          {showPcp ? (
            <Card
              to="/pcp-fabricacao"
              title="PCP - Fabricação"
              subtitle="LCs aprovadas e marcação de programação para produção."
              icon={Factory}
              accent="#22d3ee"
            />
          ) : null}
          {showGerencia ? (
            <Card
              to="/gerencia"
              title="Painel gerencial"
              subtitle="Indicadores do fluxo, status e histórico rastreável."
              icon={LayoutDashboard}
              accent="#c084fc"
            />
          ) : null}
          {showAdmin ? (
            <Card
              to="/admin/usuarios"
              title="Usuários (admin)"
              subtitle="Gestão de permissões, tipo de acesso e papéis do fluxo."
              icon={Users}
              accent="#fb7185"
            />
          ) : null}
          <Card
            to="/gestao-lc-final"
            title="Gestão LC final"
            subtitle="Controle de prazos, testes finais, PCP e comercial por OS."
            icon={Calendar}
            accent="#a78bfa"
          />
          <Card
            to="/gestao-lc-final-geral"
            title="Gestão geral LC final"
            subtitle="Visão consolidada das LCs finais e finalização."
            icon={Grid3X3}
            accent="#34d399"
          />
        </div>
      </section>
    </div>
  );
}
