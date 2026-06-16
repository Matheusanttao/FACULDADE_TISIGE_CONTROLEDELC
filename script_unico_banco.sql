-- ============================================================================
-- TISIGE - SCRIPT UNICO PARA RODAR NO SUPABASE
-- ============================================================================
--
-- ATENCAO:
--   Este script apaga e recria o schema public inteiro.
--   Use em banco novo ou quando quiser resetar os dados da aplicacao.
--
-- NAO APAGA:
--   - auth.users do Supabase Authentication
--   - Storage
--   - Edge Functions
--
-- COMO USAR:
--   Supabase Dashboard -> SQL Editor -> New query -> colar tudo -> Run
--
-- Depois, crie o usuario admin em Authentication:
--   email: admin@admin.local
--   senha: admin
--   Auto Confirm User: ON
-- Em seguida rode novamente apenas o bloco "ADMIN PADRAO", ou rode este script
-- depois de criar o usuario.
-- ============================================================================

-- ============================================================================
-- 1) RESET DO SCHEMA PUBLIC
-- ============================================================================

drop schema if exists public cascade;

create schema public;

comment on schema public is 'standard public schema';

grant usage on schema public to postgres, anon, authenticated, service_role;
grant create on schema public to postgres, anon, authenticated, service_role;

create extension if not exists pgcrypto;

-- ============================================================================
-- 2) TABELAS BASE
-- ============================================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  email text,
  setor text,
  tipo text not null default 'B' check (tipo in ('A', 'B')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Metadados do usuario; id = auth.users.id';
comment on column public.profiles.tipo is 'A = edicao completa; B = somente leitura';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, full_name, tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'tipo', 'B')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.controle_lc (
  id uuid primary key default gen_random_uuid(),
  arquivo text,
  os text not null unique,
  cliente text not null,
  equipamento text not null,
  dt_contratual date not null,
  dt_recebimento date not null,
  dt_retirada date,
  resp_retirada text default '',
  setor text not null default 'Teste',
  gaveta text,
  data_limite_testes date,
  gestao_finalizado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_controle_lc_os on public.controle_lc (os);
create index idx_controle_lc_cliente on public.controle_lc (cliente);

create table public.pesquisas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  termo_pesquisa text not null,
  created_at timestamptz not null default now()
);

create index idx_pesquisas_user on public.pesquisas (user_id);

create table public.registros_operacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tipo_operacao text not null,
  os_afetada text,
  dados_afetados jsonb,
  created_at timestamptz not null default now()
);

create index idx_registros_user on public.registros_operacoes (user_id);

-- ============================================================================
-- 3) FUNCOES E TRIGGERS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger controle_lc_updated_at
  before update on public.controle_lc
  for each row execute function public.set_updated_at();

create or replace function public.is_tipo_a()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select tipo = 'A' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ============================================================================
-- 4) RLS E POLICIES INICIAIS
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.controle_lc enable row level security;
alter table public.pesquisas enable row level security;
alter table public.registros_operacoes enable row level security;

create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_tipo_a());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "controle_lc_select_authenticated"
  on public.controle_lc for select
  to authenticated
  using (true);

create policy "controle_lc_insert_admin"
  on public.controle_lc for insert
  to authenticated
  with check (public.is_tipo_a());

create policy "controle_lc_update_admin"
  on public.controle_lc for update
  to authenticated
  using (public.is_tipo_a())
  with check (public.is_tipo_a());

create policy "controle_lc_delete_admin"
  on public.controle_lc for delete
  to authenticated
  using (public.is_tipo_a());

create policy "pesquisas_select_own"
  on public.pesquisas for select
  to authenticated
  using (user_id = auth.uid());

create policy "pesquisas_insert_own"
  on public.pesquisas for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "registros_select_own"
  on public.registros_operacoes for select
  to authenticated
  using (user_id = auth.uid());

create policy "registros_insert_own"
  on public.registros_operacoes for insert
  to authenticated
  with check (user_id = auth.uid());

-- ============================================================================
-- 5) FLUXO DE APROVACAO + PERFIS
-- ============================================================================

alter table public.controle_lc
  add column if not exists status_aprovacao text not null default 'rascunho'
    check (status_aprovacao in (
      'rascunho',
      'aguardando_aprovacao',
      'aprovado',
      'reprovado'
    ));

alter table public.controle_lc
  add column if not exists motivo_reprovacao text;

alter table public.controle_lc
  add column if not exists aprovado_em timestamptz;

alter table public.controle_lc
  add column if not exists reprovado_em timestamptz;

alter table public.controle_lc
  add column if not exists aprovador_nome text;

alter table public.controle_lc
  add column if not exists programado_fabricacao boolean not null default false;

comment on column public.controle_lc.status_aprovacao is 'Fluxo: rascunho -> aguardando -> aprovado/reprovado';
comment on column public.controle_lc.programado_fabricacao is 'PCP: marcado apos aprovacao';

alter table public.profiles
  add column if not exists papel text default 'desenhista';

comment on column public.profiles.papel is 'admin | desenhista | aprovador | pcp | gerencia | visualizador';

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

comment on function public.is_profile_admin() is 'true se o usuario logado tem profiles.papel = admin';

drop policy if exists "profiles_select" on public.profiles;

create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or public.is_tipo_a()
    or public.is_profile_admin()
  );

drop policy if exists "profiles_update_any_admin" on public.profiles;

create policy "profiles_update_any_admin"
  on public.profiles for update
  to authenticated
  using (public.is_profile_admin())
  with check (true);

-- ============================================================================
-- 6) PERMISSOES PADRAO DO SUPABASE
-- ============================================================================

grant all on all tables in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
grant all on all routines in schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to postgres, anon, authenticated, service_role;

-- ============================================================================
-- 7) RECRIAR PROFILES PARA USUARIOS AUTH EXISTENTES
-- ============================================================================

insert into public.profiles (id, username, email, full_name, tipo, papel)
select
  u.id,
  split_part(u.email, '@', 1),
  u.email,
  '',
  'B',
  'desenhista'
from auth.users u
where not exists (
  select 1
  from public.profiles p
  where p.id = u.id
);

-- ============================================================================
-- 8) ADMIN PADRAO
-- ============================================================================
-- Este bloco so funciona se o usuario admin@admin.local ja existir em
-- Authentication -> Users.

update public.profiles
set
  tipo = 'A',
  papel = 'admin',
  setor = 'Administracao',
  full_name = coalesce(nullif(trim(full_name), ''), 'Administrador')
where lower(email) = 'admin@admin.local';

-- ============================================================================
-- 9) DADOS DE EXEMPLO SIMPLES
-- ============================================================================

insert into public.controle_lc (
  arquivo,
  os,
  cliente,
  equipamento,
  dt_contratual,
  dt_recebimento,
  dt_retirada,
  resp_retirada,
  setor,
  gaveta,
  data_limite_testes,
  gestao_finalizado
) values
  (
    'LC-001',
    '17242',
    'Cliente Alpha',
    'Motor 450kW',
    '2024-02-01',
    '2024-02-10',
    '2024-03-01',
    'Joao Silva',
    'Teste',
    'G-12',
    '2024-03-28',
    false
  ),
  (
    'LC-002',
    '17232',
    'Cliente Beta',
    'Gerador 300kVA',
    '2024-02-15',
    '2024-03-01',
    null,
    '',
    'Mecanica',
    null,
    '2024-03-15',
    false
  )
on conflict (os) do nothing;

-- ============================================================================
-- 10) DADOS DE DEMONSTRACAO
-- ============================================================================

insert into public.controle_lc (
  arquivo,
  os,
  cliente,
  equipamento,
  dt_contratual,
  dt_recebimento,
  dt_retirada,
  resp_retirada,
  setor,
  gaveta,
  data_limite_testes,
  gestao_finalizado,
  status_aprovacao,
  motivo_reprovacao,
  aprovado_em,
  reprovado_em,
  aprovador_nome,
  programado_fabricacao
) values
  (
    'LC-1001',
    '90001',
    'Metalurgica Aurora',
    'Motor de tracao 250kW',
    '2026-03-05',
    '2026-03-07',
    null,
    'Recepcao tecnica',
    'Teste',
    'G-01',
    '2026-03-20',
    false,
    'rascunho',
    null,
    null,
    null,
    null,
    false
  ),
  (
    'LC-1002',
    '90002',
    'Usina Vale Verde',
    'Gerador sincrono 500kVA',
    '2026-03-01',
    '2026-03-03',
    null,
    'Carlos Souza',
    'Mecanica',
    'G-03',
    '2026-03-18',
    false,
    'aguardando_aprovacao',
    null,
    null,
    null,
    null,
    false
  ),
  (
    'LC-1003',
    '90003',
    'Polo Petroquimico Sul',
    'Motor de bombeamento 120kW',
    '2026-02-18',
    '2026-02-20',
    null,
    'Andre Lima',
    'Polo',
    'G-08',
    '2026-03-10',
    false,
    'aprovado',
    null,
    '2026-03-09T14:12:00+00',
    null,
    'Eng. Paula Mendes',
    true
  ),
  (
    'LC-1004',
    '90004',
    'Companhia de Aguas Norte',
    'Painel de comando CCM',
    '2026-02-10',
    '2026-02-12',
    null,
    'Joao Pedro',
    'Barra',
    'G-12',
    '2026-03-01',
    false,
    'reprovado',
    'Ajustar identificacao dos bornes e anexar foto final da fiacao.',
    null,
    '2026-02-28T11:05:00+00',
    'Eng. Carla Rocha',
    false
  ),
  (
    'LC-1005',
    '90005',
    'Ferrovia Atlantica',
    'Motor de ventilacao 90kW',
    '2026-01-25',
    '2026-01-28',
    '2026-02-25',
    'Marcos Vinicius',
    'Teste',
    'G-05',
    '2026-02-20',
    true,
    'aprovado',
    null,
    '2026-02-18T08:40:00+00',
    null,
    'Eng. Paula Mendes',
    true
  ),
  (
    'LC-1006',
    '90006',
    'Mineracao Serra Azul',
    'Inversor de frequencia 800A',
    '2026-03-08',
    '2026-03-09',
    null,
    'Felipe Ramos',
    'Fio Redondo',
    null,
    '2026-03-27',
    false,
    'rascunho',
    null,
    null,
    null,
    null,
    false
  ),
  (
    'LC-1007',
    '90007',
    'Terminal Portuario Leste',
    'Motor de elevacao 315kW',
    '2026-03-02',
    '2026-03-04',
    null,
    'Roberta Nunes',
    'Mecanica',
    'G-09',
    '2026-03-22',
    false,
    'aguardando_aprovacao',
    null,
    null,
    null,
    null,
    false
  ),
  (
    'LC-1008',
    '90008',
    'Papel e Celulose Horizonte',
    'Painel de automacao CLP',
    '2026-02-05',
    '2026-02-07',
    null,
    'Camila Freitas',
    'Teste',
    'G-02',
    '2026-02-28',
    false,
    'reprovado',
    'Atualizar firmware e repetir ensaio funcional de I/O.',
    null,
    '2026-02-27T16:30:00+00',
    'Eng. Carla Rocha',
    false
  )
on conflict (os) do update set
  arquivo = excluded.arquivo,
  cliente = excluded.cliente,
  equipamento = excluded.equipamento,
  dt_contratual = excluded.dt_contratual,
  dt_recebimento = excluded.dt_recebimento,
  dt_retirada = excluded.dt_retirada,
  resp_retirada = excluded.resp_retirada,
  setor = excluded.setor,
  gaveta = excluded.gaveta,
  data_limite_testes = excluded.data_limite_testes,
  gestao_finalizado = excluded.gestao_finalizado,
  status_aprovacao = excluded.status_aprovacao,
  motivo_reprovacao = excluded.motivo_reprovacao,
  aprovado_em = excluded.aprovado_em,
  reprovado_em = excluded.reprovado_em,
  aprovador_nome = excluded.aprovador_nome,
  programado_fabricacao = excluded.programado_fabricacao;

-- ============================================================================
-- 11) CHECK FINAL
-- ============================================================================

select
  status_aprovacao,
  count(*) as total
from public.controle_lc
group by status_aprovacao
order by status_aprovacao;

select
  email,
  tipo,
  papel,
  setor
from public.profiles
order by email;

-- ============================================================================
-- FIM
-- ============================================================================
