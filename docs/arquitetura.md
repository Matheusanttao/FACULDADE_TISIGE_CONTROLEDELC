# Arquitetura

## Visão geral

```
┌─────────────────┐     HTTPS      ┌──────────────────────────────┐
│  Navegador      │ ◄────────────► │  Supabase                    │
│  (React SPA)    │   REST + Auth  │  • PostgreSQL                │
│  Vite + TS      │                │  • Auth (JWT)                │
└─────────────────┘                │  • Row Level Security (RLS)  │
        │                          └──────────────────────────────┘
        │ deploy
        ▼
┌─────────────────┐
│  Vercel         │  SPA — rewrite para index.html
└─────────────────┘
```

A aplicação é uma **Single Page Application (SPA)**. Toda persistência e autenticação passam pelo cliente Supabase (`@supabase/supabase-js`); não há backend Node próprio neste repositório.

## Stack tecnológica

| Camada | Tecnologia |
| ------ | ---------- |
| UI | React 19, TypeScript |
| Build | Vite 7 |
| Estilo | Tailwind CSS v4 |
| Roteamento | React Router 7 |
| Estado global | Zustand |
| Ícones | Lucide React |
| Backend-as-a-Service | Supabase (PostgreSQL + Auth) |
| Deploy | Vercel (`vercel.json` com rewrites SPA) |

## Estrutura de pastas

```
├── docs/                    # Documentação do produto (Markdown)
│   └── atas/                # Somente PDFs assinados
├── public/                  # Assets estáticos (favicon, ícones)
├── scripts/                 # Utilitários (ex.: create-admin-user.mjs)
├── src/
│   ├── auth/                # Regras de permissão por papel
│   ├── bootstrap/           # Inicialização de sessão Auth
│   ├── components/          # Componentes reutilizáveis
│   ├── layout/              # Layout autenticado (menu, cabeçalho)
│   ├── lib/                 # Integração Supabase e serviços de domínio
│   ├── pages/               # Telas (uma por rota principal)
│   ├── routes/              # Guards: Guest, Protected, Admin
│   ├── store/               # Stores Zustand (auth, LC, notificações)
│   ├── types/               # Tipos TypeScript do domínio
│   └── utils/               # Funções auxiliares
├── supabase_align_documentacao.sql
├── index.html
├── package.json
└── vite.config.ts
```

## Módulos principais

### `src/lib/`
- **`supabase.ts`** — cliente Supabase configurado via variáveis `VITE_*`.
- **`controleLc.ts`** — CRUD e mapeamento da tabela `controle_lc`.
- **`lcHistory.ts`** — eventos da linha do tempo (`controle_lc_historico`).
- **`profile.ts`** / **`adminUsers.ts`** — perfis e gestão de usuários.
- **`loginCanonical.ts`** — normalização de login.

### `src/store/`
- **`authStore.ts`** — sessão e usuário logado.
- **`lcStore.ts`** — cache e operações de LCs na UI.
- **`notificationStore.ts`** — notificações locais.

### `src/auth/permissions.ts`
Centraliza regras de negócio de autorização no frontend (complementadas por RLS no Supabase).

## Modelo de dados (resumo)

### Tabela `controle_lc`
Registro principal de cada LC/desenho: identificação (OS, cliente, equipamento), datas, setor, status de aprovação, flags de PCP e gestão final.

### Tabela `controle_lc_historico`
Eventos rastreáveis: `criado`, `editado`, `enviado_aprovacao`, `aprovado`, `reprovado`, `programacao_pcp`.

### Tabela `profiles`
Extensão do usuário Auth: nome, setor, tipo (`A` = completo, `B` = leitura), papel (`admin`, `desenhista`, `aprovador`, `pcp`, `gerencia`, `visualizador`).

## Segurança

- Chaves expostas no frontend: apenas a **anon key** do Supabase (padrão BaaS).
- Operações sensíveis protegidas por **RLS** no PostgreSQL.
- Rotas protegidas no React (`ProtectedRoute`, `AdminRoute`).
- Arquivo `.env` ignorado pelo Git; use `.env.example` como referência.

## Rotas da aplicação

| Rota | Tela |
| ---- | ---- |
| `/login`, `/register`, `/forgot-password` | Autenticação (visitante) |
| `/` | Home / atalhos por papel |
| `/controle-lc` | Listagem de LCs |
| `/lc/new`, `/lc/:id`, `/lc/:id/edit` | Formulário de LC |
| `/aprovacao`, `/aprovacao/:id` | Fila e detalhe de aprovação |
| `/pcp-fabricacao` | Programação PCP |
| `/gestao-lc-final`, `/gestao-lc-final-geral` | Gestão de prazos |
| `/gerencia` | Dashboard gerencial |
| `/admin/usuarios` | Administração de usuários |
| `/notificacoes`, `/perfil` | Notificações e perfil |
