import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import {
  canChangeLCStatus,
  canCreateLC,
  canEditLCRecord,
  canSubmitForApproval,
  resolvePapel,
} from '@/auth/permissions';
import { LCHistoryTimeline } from '@/components/LCHistoryTimeline';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { useLCStore } from '@/store/lcStore';
import { SETORES, type ControleLC, type StatusAprovacao } from '@/types/models';

const empty: Omit<ControleLC, 'id'> = {
  arquivo: '',
  revisao: 0,
  os: '',
  cliente: '',
  equipamento: '',
  dtContratual: '',
  dtRecebimento: '',
  dtRetirada: '',
  respRetirada: '',
  setor: 'Teste',
  gaveta: '',
  dataLimiteTestes: '',
  gestaoFinalizado: false,
  statusAprovacao: 'rascunho',
  programadoFabricacao: false,
};

function isIsoDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function LCFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const mode = path.endsWith('/new')
    ? 'create'
    : path.endsWith('/edit')
      ? 'edit'
      : 'view';

  const user = useAuthStore((s) => s.user);
  const add = useLCStore((s) => s.add);
  const update = useLCStore((s) => s.update);
  const findById = useLCStore((s) => s.findById);
  const fetchById = useLCStore((s) => s.fetchById);
  const submitForApproval = useLCStore((s) => s.submitForApproval);
  const changeStatus = useLCStore((s) => s.changeStatus);

  const [form, setForm] = useState<Omit<ControleLC, 'id'>>(empty);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);

  const editing = mode === 'edit' && id;
  const viewing = mode === 'view' && id;
  const readOnly = mode === 'view';
  const row = id ? findById(id) : undefined;

  useEffect(() => {
    if (id && (editing || viewing) && !findById(id)) {
      void fetchById(id);
    }
  }, [id, editing, viewing, findById, fetchById]);

  useEffect(() => {
    if ((editing || viewing) && id) {
      const r = findById(id);
      if (r) {
        const { id: _id, ...rest } = r;
        setForm({
          ...empty,
          ...rest,
          dtRetirada: rest.dtRetirada || '',
          dataLimiteTestes: rest.dataLimiteTestes || '',
          gaveta: rest.gaveta || '',
          motivoReprovacao: rest.motivoReprovacao,
        });
      }
    }
  }, [editing, viewing, id, row]);

  useEffect(() => {
    if (mode === 'edit' && row && user) {
      if (!canEditLCRecord(user, row)) {
        navigate(`/lc/${row.id}`, { replace: true });
      }
    }
  }, [mode, row, user, navigate]);

  const set =
    (key: keyof Omit<ControleLC, 'id'>) => (v: string) =>
      setForm((f) => ({ ...f, [key]: v }));

  const editable =
    !readOnly &&
    (mode === 'create'
      ? canCreateLC(user)
      : row
        ? canEditLCRecord(user, row)
        : false);

  const mergedForFlow: ControleLC | null = row
    ? { ...row, ...form, id: row.id }
    : null;
  const showSubmit =
    !readOnly &&
    mergedForFlow &&
    canSubmitForApproval(user, mergedForFlow) &&
    (mergedForFlow.statusAprovacao === 'rascunho' ||
      mergedForFlow.statusAprovacao === 'reprovado');

  const title =
    mode === 'create'
      ? 'Novo desenho técnico'
      : readOnly
        ? 'Detalhes do desenho técnico'
        : 'Editar desenho técnico';

  const onManualStatusChange = async (status: StatusAprovacao) => {
    if (!row) return;
    if (
      !confirm(
        `Alterar status do desenho OS ${row.os} para "${status}"? Esta ação ficará no histórico.`
      )
    ) {
      return;
    }
    setStatusChanging(true);
    try {
      const r = await changeStatus(row.id, status);
      if (!r.ok) {
        alert(r.error ?? 'Erro');
      }
    } finally {
      setStatusChanging(false);
    }
  };

  const onSave = async () => {
    if (!form.os.trim() || !form.cliente.trim() || !form.equipamento.trim()) {
      alert('Preencha OS, cliente e equipamento.');
      return;
    }
    if (!isIsoDate(form.dtContratual) || !isIsoDate(form.dtRecebimento)) {
      alert('Datas contratual e recebimento: formato AAAA-MM-DD.');
      return;
    }
    setSaving(true);
    try {
      if (mode === 'create') {
        const r = await add(form);
        if (!r.ok) {
          alert(r.error ?? 'Erro');
          return;
        }
      } else if (id) {
        const r = await update(id, form);
        if (!r.ok) {
          alert(r.error ?? 'Erro');
          return;
        }
      }
      navigate(-1);
    } finally {
      setSaving(false);
    }
  };

  const onSubmitApproval = () => {
    if (!id || !row) return;
    if (!form.os.trim() || !form.cliente.trim() || !form.equipamento.trim()) {
      alert('Preencha OS, cliente e equipamento antes de enviar.');
      return;
    }
    if (!isIsoDate(form.dtContratual) || !isIsoDate(form.dtRecebimento)) {
      alert('Datas em AAAA-MM-DD.');
      return;
    }
    if (
      !confirm(
        'Os dados serão salvos e o desenho ficará na fila do aprovador. Continuar?'
      )
    ) {
      return;
    }
    void (async () => {
      setSubmitting(true);
      try {
        const rUpdate = await update(id, form);
        if (!rUpdate.ok) {
          alert(rUpdate.error ?? 'Erro');
          return;
        }
        const r = await submitForApproval(id);
        if (!r.ok) {
          alert(r.error ?? 'Erro');
          return;
        }
        navigate(-1);
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>

      <div className="mx-auto max-w-6xl space-y-4">
        {row ? (
          <div className="space-y-3 rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={form.statusAprovacao} />
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                Revisão {form.revisao}
              </span>
            </div>
            <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
              <p>Cadastrado por: {form.criadoPorNome || '—'}</p>
              <p>
                Enviado aprovação:{' '}
                {form.enviadoAprovacaoEm
                  ? new Date(form.enviadoAprovacaoEm).toLocaleString('pt-BR')
                  : '—'}
              </p>
            </div>
            {form.statusAprovacao === 'aprovado' && (
              <p className="text-xs text-slate-500">
                {form.aprovadorNome ? `Aprovado por ${form.aprovadorNome}` : 'Aprovado'}{' '}
                {form.aprovadoEm
                  ? `· ${new Date(form.aprovadoEm).toLocaleString('pt-BR')}`
                  : ''}
              </p>
            )}
            {form.statusAprovacao === 'reprovado' && form.motivoReprovacao ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-xs font-bold text-red-300">Motivo da reprovação</p>
                <p className="text-sm text-slate-200">{form.motivoReprovacao}</p>
              </div>
            ) : null}
            {form.statusAprovacao === 'aprovado' && form.programadoFabricacao ? (
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                <p className="text-sm font-semibold text-cyan-300">
                  Programado para fabricação (PCP)
                </p>
                <p className="text-xs text-slate-500">
                  {form.pcpNome ? `Responsável: ${form.pcpNome}` : 'Responsável: —'}
                  {form.programadoFabricacaoEm
                    ? ` · ${new Date(form.programadoFabricacaoEm).toLocaleString('pt-BR')}`
                    : ''}
                </p>
              </div>
            ) : null}
            {canChangeLCStatus(user) ? (
              <label className="flex flex-col gap-1.5 pt-2 sm:max-w-xs">
                <span className="text-sm font-medium text-slate-400">
                  Alterar status manualmente
                </span>
                <select
                  value={form.statusAprovacao}
                  disabled={statusChanging}
                  onChange={(e) =>
                    void onManualStatusChange(e.target.value as StatusAprovacao)
                  }
                  className="rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)] px-4 py-3 text-[var(--color-tisige-text)] outline-none focus:border-cyan-500/50"
                >
                  <option value="rascunho">Rascunho</option>
                  <option value="aguardando_aprovacao">Aguardando aprovação</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="reprovado">Reprovado</option>
                </select>
              </label>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-4 rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-4 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Input
              label="Arquivo/link do desenho técnico"
              value={form.arquivo}
              onChange={(e) => set('arquivo')(e.target.value)}
              readOnly={!editable}
            />
          </div>
          <Input
            label="OS *"
            value={form.os}
            onChange={(e) => set('os')(e.target.value)}
            readOnly={!editable || mode !== 'create'}
          />
          <Input
            label="Cliente *"
            value={form.cliente}
            onChange={(e) => set('cliente')(e.target.value)}
            readOnly={!editable}
          />
          <label className="flex flex-col gap-1.5 lg:col-span-2">
            <span className="text-sm font-medium text-slate-400">Equipamento *</span>
            <textarea
              value={form.equipamento}
              onChange={(e) => set('equipamento')(e.target.value)}
              readOnly={!editable}
              rows={3}
              className="rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)] px-4 py-3 text-[var(--color-tisige-text)] outline-none focus:border-cyan-500/50"
            />
          </label>
          <Input
            label="Data contratual * (AAAA-MM-DD)"
            value={form.dtContratual}
            onChange={(e) => set('dtContratual')(e.target.value)}
            readOnly={!editable}
          />
          <Input
            label="Data recebimento * (AAAA-MM-DD)"
            value={form.dtRecebimento}
            onChange={(e) => set('dtRecebimento')(e.target.value)}
            readOnly={!editable}
          />
          <div className="lg:col-span-2">
            <p className="text-sm font-medium text-slate-400">Setor</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SETORES.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={!editable}
                  onClick={() => editable && setForm((f) => ({ ...f, setor: s }))}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    form.setor === s
                      ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-200'
                      : 'border-[var(--color-tisige-border)] text-slate-400 hover:bg-white/5'
                  } ${!editable ? 'opacity-50' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {readOnly ? (
          <p className="text-xs text-slate-500">
            Perfil: {resolvePapel(user)} · Somente leitura.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {!readOnly ? (
            <Button type="button" onClick={() => void onSave()} loading={saving}>
              Salvar
            </Button>
          ) : null}
          {showSubmit ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onSubmitApproval}
              loading={submitting}
            >
              <Send className="size-4" /> Enviar para aprovação técnica
            </Button>
          ) : null}
        </div>
        {row ? <LCHistoryTimeline lcId={row.id} /> : null}
      </div>
    </div>
  );
}
