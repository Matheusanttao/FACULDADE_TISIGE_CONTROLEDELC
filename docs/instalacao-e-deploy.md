# Instalação e deploy

## Requisitos

- **Node.js** 20 ou superior
- **npm** (incluso com Node)
- Projeto **Supabase** configurado (tabelas `profiles`, `controle_lc`, RLS)
- Script SQL `supabase_align_documentacao.sql` executado no SQL Editor do Supabase (se ainda não aplicado)

## Configuração local

### 1. Clonar o repositório

```bash
git clone https://github.com/Matheusanttao/FACULDADE_TISIGE_CONTROLEDELC.git
cd FACULDADE_TISIGE_CONTROLEDELC
```

### 2. Variáveis de ambiente

Copie o exemplo e preencha com os dados do Supabase (Settings → API):

```bash
cp .env.example .env
```

| Variável | Descrição |
| -------- | --------- |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (anon) |

> Nunca commite o arquivo `.env`. Ele já está listado no `.gitignore`.

### 3. Instalar dependências e rodar

```bash
npm install
npm run dev
```

A aplicação abre em **http://localhost:5173**.

### 4. Build de produção

```bash
npm run build
npm run preview
```

## Deploy na Vercel

1. Conecte o repositório GitHub à Vercel.
2. Configure as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no painel da Vercel.
3. O arquivo `vercel.json` já define rewrites para SPA (todas as rotas → `index.html`).

## Scripts disponíveis

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Compila TypeScript e gera build estático |
| `npm run preview` | Preview local do build |
| `npm run lint` | ESLint |
| `npm run seed:admin` | Cria usuário administrador (requer credenciais de serviço) |

## Banco de dados

Execute no **Supabase Dashboard → SQL Editor**:

1. Migrations base do projeto (se aplicável).
2. `supabase_align_documentacao.sql` — revisão, histórico, papéis e RLS alinhados à documentação.

## Checklist antes de entregar à coordenação

- [ ] Repositório GitHub atualizado com código e documentação em `docs/`
- [ ] PDFs assinados das atas em `docs/atas/` (somente PDF)
- [ ] README.md na raiz com link para a documentação
- [ ] `.env` e segredos **fora** do Git
- [ ] Aplicação acessível (local ou deploy) para demonstração
