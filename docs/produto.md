# Produto — TISIGE Web (Controle de LC)

## O que é

O **TISIGE Web** é um sistema web para **gestão de desenhos técnicos** e **Lista de Controle (LC)** em ambiente industrial. Ele digitaliza o fluxo que antes existia em planilhas e no legado PHP/HTML (`TISIGE2`), permitindo cadastro, aprovação técnica, programação de fabricação (PCP), gestão de prazos e rastreabilidade completa de cada revisão.

## Problema que resolve

- Centralizar informações de desenhos (OS, cliente, equipamento, setor, datas).
- Garantir que apenas revisões aprovadas avancem para fabricação.
- Registrar quem fez cada ação e quando (histórico auditável).
- Oferecer visão gerencial de prazos e pendências.
- Controlar acesso por papel (desenhista, aprovador, PCP, gerência, admin).

## Público-alvo

| Papel | Uso principal |
| ----- | ------------- |
| Desenhista | Cadastra e edita LCs em rascunho; envia para aprovação |
| Aprovador | Analisa, aprova ou reprova revisões técnicas |
| PCP | Marca desenhos aprovados como programados para fabricação |
| Gerência | Acompanha indicadores, prazos e gestão LC final |
| Admin | Gerencia usuários e permissões |
| Visualizador (tipo B) | Consulta sem alterar registros |

## Funcionalidades principais

### Autenticação e perfil
- Login, cadastro e recuperação de senha (Supabase Auth).
- Perfil do usuário com setor, tipo de acesso (A/B) e papel funcional.

### Controle de LC
- Listagem com filtros e busca.
- Criação, edição, visualização e exclusão (conforme permissão).
- Campos: arquivo/revisão, OS, cliente, equipamento, datas contratuais, setor, gaveta, responsável pela retirada, etc.

### Fluxo de aprovação
- Estados: `rascunho` → `aguardando_aprovacao` → `aprovado` ou `reprovado`.
- Reprovação exige motivo; desenhista corrige e reenvia (incremento de revisão).

### PCP e fabricação
- Marcação de desenhos aprovados como programados para fabricação.
- Registro de responsável PCP e data/hora.

### Gestão LC final
- Controle de prazos (+5 e +15 dias) e finalização da gestão por OS.
- Visão geral consolidada para acompanhamento.

### Painel gerencial
- Dashboard com métricas e status das LCs (acesso gerência e visualizadores tipo B).

### Administração
- CRUD de usuários (apenas admin).
- Script auxiliar `npm run seed:admin` para criar usuário administrador inicial.

### Histórico e notificações
- Linha do tempo por LC (criação, edição, envio, aprovação, reprovação, PCP).
- Notificações locais no navegador (localStorage).

## Setores suportados

Barra, Fio Redondo, Mecânica, Polo e Teste.

## Relação com outros componentes

| Componente | Descrição |
| -------- | --------- |
| **Este repositório** | Frontend web (React + Vite) |
| **Supabase** | Banco PostgreSQL, autenticação e políticas RLS |
| **TISIGE-Mobile** (opcional) | App mobile Expo/React Native — mesma API |
| **TISIGE2** (legado) | Referência de regras de negócio em PHP/HTML |

## Script SQL de alinhamento

O arquivo `supabase_align_documentacao.sql` na raiz do repositório contém migrations complementares (coluna `revisao`, tabela `controle_lc_historico`, papéis de usuário e políticas RLS) para alinhar o banco à documentação acadêmica do produto.
