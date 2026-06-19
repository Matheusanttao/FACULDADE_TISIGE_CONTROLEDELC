-- ============================================================================
-- TISIGE - alinhamento com a documentação acadêmica
-- Gestão de desenhos técnicos com aprovação, revisão, PCP e rastreabilidade.
-- Execute no Supabase Dashboard -> SQL Editor.
-- ============================================================================

create extension if not exists pgcrypto;

alter table public.profiles
  add column if not exists papel text default 'desenhista';

alter table public.controle_lc
  add column if not exists revisao integer not null default 0,
  add column if not exists criado_por uuid references auth.users (id) on delete set null,
  add column if not exists criado_por_nome text,
  add column if not exists enviado_aprovacao_em timestamptz,
  add column if not exists programado_fabricacao_em timestamptz,
  add column if not exists pcp_nome text;

comment on column public.controle_lc.revisao is
  'Número da revisão técnica do desenho/LC. Incrementa quando um desenho reprovado é corrigido.';
comment on column public.controle_lc.criado_por_nome is
  'Nome do desenhista responsável pelo cadastro.';
comment on column public.controle_lc.enviado_aprovacao_em is
  'Data/hora em que a revisão foi enviada para aprovação técnica.';
comment on column public.controle_lc.programado_fabricacao_em is
  'Data/hora da marcação do PCP para fabricação.';
comment on column public.controle_lc.pcp_nome is
  'Responsável PCP pela marcação de fabricação.';

create table if not exists public.controle_lc_historico (
  id uuid primary key default gen_random_uuid(),
  lc_id uuid not null references public.controle_lc (id) on delete cascade,
  os text not null,
  acao text not null check (acao in (
    'criado',
    'editado',
    'enviado_aprovacao',
    'aprovado',
    'reprovado',
    'programacao_pcp'
  )),
  descricao text not null,
  responsavel_id uuid references auth.users (id) on delete set null,
  responsavel_nome text,
  responsavel_papel text,
  created_at timestamptz not null default now()
);

comment on table public.controle_lc_historico is
  'Linha do tempo rastreável do fluxo de desenhos técnicos: alterações, aprovações, reprovações e PCP.';

create index if not exists idx_controle_lc_historico_lc
  on public.controle_lc_historico (lc_id, created_at desc);

create index if not exists idx_controle_lc_historico_os
  on public.controle_lc_historico (os);

create or replace function public.current_profile_papel()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select p.papel from public.profiles p where p.id = auth.uid()),
    'visualizador'
  );
$$;

create or replace function public.is_profile_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select p.papel = 'admin' from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

alter table public.controle_lc enable row level security;
alter table public.controle_lc_historico enable row level security;

drop policy if exists "controle_lc_insert_admin" on public.controle_lc;
drop policy if exists "controle_lc_update_admin" on public.controle_lc;
drop policy if exists "controle_lc_delete_admin" on public.controle_lc;
drop policy if exists "controle_lc_insert_flow" on public.controle_lc;
drop policy if exists "controle_lc_update_flow" on public.controle_lc;
drop policy if exists "controle_lc_delete_flow" on public.controle_lc;

create policy "controle_lc_insert_flow"
  on public.controle_lc for insert
  to authenticated
  with check (
    public.is_profile_admin()
    or (public.is_tipo_a() and public.current_profile_papel() = 'desenhista')
  );

create policy "controle_lc_update_flow"
  on public.controle_lc for update
  to authenticated
  using (
    public.is_profile_admin()
    or (
      public.is_tipo_a()
      and public.current_profile_papel() in ('desenhista', 'aprovador', 'pcp')
    )
  )
  with check (
    public.is_profile_admin()
    or (
      public.is_tipo_a()
      and public.current_profile_papel() in ('desenhista', 'aprovador', 'pcp')
    )
  );

create policy "controle_lc_delete_flow"
  on public.controle_lc for delete
  to authenticated
  using (
    public.is_profile_admin()
    or (
      public.is_tipo_a()
      and public.current_profile_papel() = 'desenhista'
      and status_aprovacao in ('rascunho', 'reprovado')
    )
  );

drop policy if exists "controle_lc_historico_select" on public.controle_lc_historico;
drop policy if exists "controle_lc_historico_insert" on public.controle_lc_historico;

create policy "controle_lc_historico_select"
  on public.controle_lc_historico for select
  to authenticated
  using (true);

create policy "controle_lc_historico_insert"
  on public.controle_lc_historico for insert
  to authenticated
  with check (
    public.is_profile_admin()
    or public.is_tipo_a()
    or responsavel_id = auth.uid()
  );

grant all on public.controle_lc_historico to authenticated, service_role;
