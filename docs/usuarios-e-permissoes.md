# Usuários e permissões

## Tipos de acesso

| Tipo | Código | Descrição |
| ---- | ------ | --------- |
| Completo | **A** | Pode executar ações conforme o papel |
| Leitura | **B** | Apenas visualização (sem criar/editar/aprovar) |

## Papéis funcionais

| Papel | Responsabilidade |
| ----- | ---------------- |
| `admin` | Gestão de usuários e acesso total administrativo |
| `desenhista` | Cadastro, edição e envio de LCs |
| `aprovador` | Aprovação ou reprovação técnica |
| `pcp` | Programação de fabricação |
| `gerencia` | Dashboard e gestão LC final |
| `visualizador` | Consulta (padrão para tipo B) |

O papel é definido na tabela `profiles` (coluna `papel`). A lógica de fallback está em `src/auth/permissions.ts`.

## Matriz de permissões (frontend)

| Ação | Desenhista | Aprovador | PCP | Gerência | Admin | Visualizador (B) |
| ---- | :--------: | :-------: | :-: | :------: | :---: | :--------------: |
| Criar LC | ✓ | | | | | |
| Editar LC (rascunho/reprovado) | ✓ | | | | | |
| Enviar para aprovação | ✓ | | | | | |
| Aprovar / reprovar | | ✓ | | | | |
| Programar fabricação | | | ✓ | | | |
| Dashboard gerencial | | | | ✓ | | ✓ (tipo B) |
| Gestão LC final | | | | ✓ | | |
| Gerenciar usuários | | | | | ✓ | |
| Visualizar LCs | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

> As políticas **RLS** no Supabase reforçam essas regras no banco de dados.

## Setores

Usuários são associados a um setor: Barra, Fio Redondo, Mecânica, Polo ou Teste.

## Criação do administrador inicial

```bash
npm run seed:admin
```

O script `scripts/create-admin-user.mjs` usa variáveis de ambiente do Supabase (service role) para criar o primeiro usuário admin. Configure as credenciais conforme `.env.example` antes de executar.

## Cadastro de novos usuários

- Usuários podem se registrar em `/register` (Auth Supabase).
- O admin ajusta papel, tipo e setor em `/admin/usuarios`.
