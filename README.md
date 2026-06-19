# TISIGE Web — Sistema de Gestão de Desenhos Técnicos com Fluxo de Aprovação

Sistema web para **controle e comunicação** entre os setores de Engenharia (Desenho), Aprovação Técnica e Planejamento e Controle da Produção (PCP), com foco em **rastreabilidade**, **validação** e **organização** do fluxo de desenhos técnicos.

**Repositório:** https://github.com/Matheusanttao/FACULDADE_TISIGE_CONTROLEDELC

---

## Equipe e instituição

| | |
| --- | --- |
| **Integrantes** | Daniel de Oliveira, Danilo de Oliveira, Luiz Fernando, Matheus Antão, Rafael Bernardoni, Saul Netto |
| **Instituição** | PUC Minas — Campus Betim |
| **Curso** | Bacharelado em Sistemas de Informação |

---

## Sobre o projeto

O **TISIGE Web** integra desenhista, aprovador, PCP e gerência em um fluxo digital: cadastro de desenhos, aprovação ou reprovação com motivo, notificação visual, programação de fabricação e acompanhamento gerencial em tempo real.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Auth)

---

## Documentação

### Documentação acadêmica (PROPPG)

Texto completo do projeto — tema, introdução, problemática, justificativa, objetivos, referencial teórico, metodologia, protótipo, requisitos e referências:

➡️ **[docs/documentacao-academica.md](./docs/documentacao-academica.md)**

### Documentação técnica do produto

| Documento | Conteúdo |
| --------- | -------- |
| [docs/README.md](./docs/README.md) | Índice da documentação |
| [produto.md](./docs/produto.md) | Visão geral e funcionalidades |
| [arquitetura.md](./docs/arquitetura.md) | Stack e estrutura do código |
| [fluxo-de-trabalho.md](./docs/fluxo-de-trabalho.md) | Ciclo de vida da LC |
| [usuarios-e-permissoes.md](./docs/usuarios-e-permissoes.md) | Papéis e permissões |
| [instalacao-e-deploy.md](./docs/instalacao-e-deploy.md) | Como rodar e publicar |
| [docs/atas/](./docs/atas/) | **Somente PDFs assinados** (professor, alunos e parceiros) |

---

## Início rápido

### Requisitos

- Node.js 20+
- Projeto Supabase configurado

### Configuração

1. Copie `.env.example` para `.env` na raiz do projeto.
2. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (Supabase → Settings → API).
3. Execute:

```bash
npm install
npm run dev
```

Abre em http://localhost:5173.

### Scripts

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run seed:admin` | Criar usuário administrador inicial |

---

## Funcionalidades implementadas

- Cadastro e autenticação de usuários (Desenhista, Aprovador, PCP, Gerência, Admin)
- CRUD de desenhos técnicos (LC) com controle por perfil
- Fluxo de aprovação com revisões, motivo de reprovação e notificações
- Consulta e marcação de fabricação pelo PCP
- Gestão LC final (+5/+15 dias) e painel gerencial
- Histórico rastreável de alterações e decisões
- Busca e filtros por OS, cliente e equipamento

---

## Estrutura do repositório

```
├── docs/
│   ├── documentacao-academica.md   # Documento acadêmico completo
│   ├── produto.md                  # Documentação do produto
│   └── atas/                       # PDFs assinados das reuniões
├── public/
├── scripts/
├── src/                            # Código-fonte React
└── supabase_align_documentacao.sql
```

---

## Uso acadêmico

Projeto desenvolvido no contexto das disciplinas de TI da PUC Minas Betim, conforme orientação da PROPPG.
