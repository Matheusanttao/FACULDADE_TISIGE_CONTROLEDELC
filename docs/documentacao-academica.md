# Desenvolvimento de um Sistema de Gestão de Desenhos Técnicos com Fluxo de Aprovação

**Integrantes:** Daniel de Oliveira, Danilo de Oliveira, Luiz Fernando, Matheus Antão, Rafael Bernardoni, Saul Netto

**Instituição:** PUC Minas em Betim  
**Curso:** Bacharelado em Sistemas de Informação

---

## 1. Tema

Desenvolvimento de um sistema para controle e comunicação entre setores de Engenharia (Desenho), Aprovação Técnica e Planejamento e Controle da Produção (PCP), com foco em rastreabilidade, validação e organização do fluxo de desenhos técnicos.

---

## 2. Introdução

No contexto industrial, a comunicação eficiente entre os setores de engenharia, aprovação técnica e planejamento da produção é essencial para garantir a qualidade, a rastreabilidade e a agilidade no desenvolvimento de produtos. Segundo Slack, Brandon-Jones e Johnston (2018), a integração dos processos organizacionais contribui diretamente para a redução de falhas operacionais, melhoria da qualidade e aumento da eficiência produtiva.

Muitas empresas ainda enfrentam dificuldades relacionadas à descentralização das informações, falhas na validação de documentos técnicos e ausência de um fluxo estruturado de acompanhamento. De acordo com Laudon e Laudon (2021), a falta de sistemas integrados pode comprometer a comunicação entre departamentos, gerar inconsistências nos dados e aumentar a ocorrência de retrabalho.

Diante desse cenário, este projeto propõe o desenvolvimento de um sistema informatizado capaz de integrar os setores de Engenharia (Desenho), Aprovação Técnica e Planejamento e Controle da Produção (PCP) por meio de um fluxo simples e eficiente. O sistema permitirá que o desenhista registre os dados de um desenho técnico, que será posteriormente avaliado por um aprovador responsável. Em caso de reprovação, o sistema notificará visualmente o desenhista, permitindo correções. Já os desenhos aprovados poderão ser consultados pelo setor de PCP, que poderá indicar se o item foi programado para fabricação.

Além disso, a solução permitirá que a gerência acompanhe, em tempo real, o status dos desenhos, promovendo maior transparência e controle sobre o processo. Conforme destaca Sommerville (2019), sistemas de informação voltados para a gestão de processos contribuem para o monitoramento das atividades organizacionais, auxiliando na tomada de decisões e no controle das operações.

Dessa forma, o sistema busca reduzir falhas de comunicação, melhorar a organização das informações e aumentar a eficiência operacional entre os setores envolvidos, proporcionando maior confiabilidade e rastreabilidade dos dados utilizados durante o ciclo de desenvolvimento e produção.

---

## 3. Problemática

No ambiente industrial, a gestão de desenhos técnicos frequentemente enfrenta desafios relacionados à descentralização das informações, à ausência de um fluxo estruturado de aprovação e à falta de rastreabilidade das alterações realizadas. Em muitos casos, a comunicação entre os setores de engenharia, aprovação técnica e Planejamento e Controle da Produção (PCP) ocorre de forma informal ou por meio de ferramentas não integradas, como e-mails e planilhas, o que aumenta o risco de falhas, retrabalho e inconsistências nos dados.

Esse cenário é observado em empresas do setor metalmecânico que ainda não adotaram sistemas digitais integrados de gerenciamento de documentos técnicos. A ausência de uma plataforma centralizada para o controle e o fluxo de aprovação de desenhos técnicos nesses ambientes dificulta o acompanhamento do status dos documentos, tornando o processo de validação menos eficiente e reduzindo a transparência para a gerência, o que pode impactar diretamente na eficiência operacional.

**Questão de pesquisa:** como o desenvolvimento de um sistema web integrado pode otimizar o fluxo de aprovação, o controle de revisões e a rastreabilidade de desenhos técnicos nos setores de engenharia e PCP de uma empresa do setor metalmecânico?

---

## 4. Justificativa

A proposta de desenvolvimento de um sistema de gestão de desenhos técnicos com fluxo de aprovação justifica-se pela necessidade de melhorar a organização, a comunicação e a confiabilidade das informações no ambiente industrial. A ausência de ferramentas integradas para esse tipo de controle pode gerar atrasos, retrabalho e erros na produção, impactando diretamente nos custos e na qualidade dos produtos.

Com a implementação de um sistema informatizado, será possível centralizar as informações, padronizar o processo de aprovação e garantir maior rastreabilidade das alterações realizadas nos desenhos. Isso permite maior controle sobre o ciclo de vida dos documentos técnicos, além de facilitar a tomada de decisão pelos gestores.

Outro ponto relevante é a melhoria na comunicação entre os setores, reduzindo a dependência de processos manuais e informais. A visibilidade em tempo real do status dos desenhos possibilita maior transparência e eficiência operacional.

Dessa forma, o sistema proposto contribui não apenas para a organização interna da empresa, mas também para a redução de falhas, aumento da produtividade e melhoria contínua dos processos envolvidos no desenvolvimento e na produção.

---

## 5. Objetivos

### Objetivo geral

Desenvolver um sistema informatizado para gerenciamento de desenhos técnicos, permitindo a integração entre os setores de engenharia, aprovação e Planejamento e Controle da Produção (PCP), com foco na organização, rastreabilidade e eficiência do fluxo de trabalho.

### Objetivos específicos

- Permitir o cadastro de desenhos técnicos pelo setor de engenharia (desenhista), contendo os dados necessários para identificação e análise;
- Implementar um fluxo de aprovação, no qual um responsável possa aprovar ou reprovar os desenhos cadastrados;
- Sinalizar visualmente o status dos desenhos (aprovado ou reprovado), facilitando a identificação rápida pelos usuários;
- Disponibilizar os desenhos aprovados para consulta pelo setor de PCP;
- Permitir ao PCP indicar se o desenho foi programado para fabricação, por meio de marcação específica;
- Possibilitar à gerência o acompanhamento geral dos desenhos e seus respectivos status em tempo real;
- Garantir organização e centralização das informações, evitando falhas de comunicação entre os setores.

---

## 6. Referencial Teórico

### 6.1 Transformação Digital e Integração de Processos

A transformação digital no ambiente industrial tem contribuído significativamente para a modernização dos processos organizacionais, promovendo a substituição de atividades manuais por sistemas informatizados capazes de aumentar a eficiência operacional e a qualidade das informações. Segundo Laudon e Laudon (2021), os sistemas de informação desempenham papel fundamental na integração das áreas organizacionais, permitindo que dados sejam compartilhados de forma rápida e confiável entre diferentes setores da empresa.

Além disso, a integração de processos possibilita maior alinhamento entre as atividades organizacionais, reduzindo falhas de comunicação e aumentando a produtividade. De acordo com Slack, Brandon-Jones e Johnston (2018), organizações que utilizam sistemas integrados conseguem melhorar o fluxo de informações e obter maior controle sobre suas operações. Dessa forma, atividades como o gerenciamento de desenhos técnicos tornam-se mais organizadas, rastreáveis e confiáveis.

### 6.2 Gestão de Desenhos Técnicos e Fluxo de Aprovação

A gestão de desenhos técnicos envolve o controle, armazenamento, atualização e versionamento de documentos utilizados no desenvolvimento e fabricação de produtos. Esses documentos contêm especificações fundamentais para os processos produtivos, tornando indispensável a utilização de mecanismos que garantam a integridade e a atualização das informações. Conforme afirma Rozenfeld et al. (2006), a gestão adequada da documentação técnica é essencial para assegurar a qualidade e a padronização dos processos de desenvolvimento de produtos.

O fluxo de aprovação é responsável por validar os documentos antes de sua utilização pelas áreas produtivas. Segundo Sommerville (2019), processos de validação e verificação contribuem para a redução de erros, garantindo que apenas informações corretas e aprovadas sejam disponibilizadas aos usuários. Dessa forma, o fluxo de aprovação auxilia na prevenção de falhas operacionais e no aumento da confiabilidade dos dados utilizados pela organização.

### 6.3 Rastreabilidade e Planejamento e Controle da Produção (PCP)

A rastreabilidade consiste na capacidade de acompanhar o histórico de um documento ou processo, registrando informações sobre alterações realizadas, responsáveis envolvidos e versões produzidas. De acordo com a norma ISO 9001:2015, a rastreabilidade é um elemento importante para o controle da qualidade, pois permite identificar a origem das informações e acompanhar modificações realizadas ao longo do tempo.

No contexto industrial, o Planejamento e Controle da Produção (PCP) utiliza informações técnicas para programar e controlar as atividades produtivas. Segundo Corrêa, Corrêa e Caon (2019), o PCP é responsável por coordenar recursos e informações necessários para que a produção ocorra de forma eficiente e alinhada aos objetivos da organização. Assim, a integração entre rastreabilidade, gestão documental e PCP contribui para a redução de retrabalho, melhoria da qualidade e aumento da eficiência operacional.

---

## 7. Metodologia

Este trabalho caracteriza-se como uma **pesquisa aplicada**, pois visa gerar conhecimento para aplicação prática na solução de um problema específico identificado no ambiente industrial (GIL, 2017): a ausência de um fluxo estruturado para gestão e aprovação de desenhos técnicos entre os setores de Engenharia, Aprovação Técnica e Planejamento e Controle da Produção (PCP).

Quanto aos procedimentos técnicos, a pesquisa combina **levantamento bibliográfico** e **desenvolvimento experimental de software** (PRODANOV; FREITAS, 2013), organizando-se em duas etapas complementares:

1. **Revisão bibliográfica** com base em autores como Laudon e Laudon (2021), Slack, Brandon-Jones e Johnston (2018), Sommerville (2019), Rozenfeld et al. (2006) e Corrêa, Gianesi e Caon (2019), que fundamentaram teoricamente os temas de sistemas de informação, gestão de processos, fluxo de aprovação de documentos técnicos e rastreabilidade.

2. **Desenvolvimento prático** do sistema proposto, com levantamento de requisitos funcionais e não funcionais, prototipação de telas e construção de um protótipo funcional.

O desenvolvimento do sistema seguiu uma **abordagem ágil**, permitindo ciclos iterativos de planejamento, implementação e validação. Essa metodologia favorece a adaptação contínua às necessidades identificadas ao longo do processo, reduzindo riscos e permitindo entregas incrementais (GIL, 2017). A prototipação das telas foi realizada previamente à implementação, possibilitando a visualização do fluxo de navegação e a validação das funcionalidades planejadas antes do desenvolvimento efetivo.

O sistema foi concebido para integrar quatro perfis de usuário: **Desenhista**, **Aprovador**, **PCP** e **Gerência**, cada um com permissões e responsabilidades específicas dentro do fluxo. A definição dos requisitos funcionais e não funcionais orientou as decisões de desenvolvimento, garantindo que critérios como usabilidade, segurança, rastreabilidade e disponibilidade fossem considerados desde as fases iniciais do projeto (PRODANOV; FREITAS, 2013).

A validação do sistema ocorre por meio da análise do protótipo funcional desenvolvido, verificando se as funcionalidades implementadas atendem aos objetivos propostos e se o fluxo de aprovação de desenhos técnicos é executado de forma organizada, rastreável e eficiente.

---

## 8. Protótipo das telas

O protótipo funcional **TISIGE Web** implementa as principais telas planejadas. Abaixo, a descrição das interfaces validadas no desenvolvimento.

### 8.1 Gestão geral LC final

Tela de acompanhamento de prazos e status de finalização por OS, exibindo:

- Lista de ordens de serviço (ex.: OS 90001 a OS 90006);
- Marcos de prazo: **Testes finais**, **LC-PCP** e **LC-Comercial**;
- Indicador de **Finalizado** por OS;
- Menu lateral: Início, Controle LC, Gestão LC final, Gestão geral, Notificações e Conta.

**Rota no sistema:** `/gestao-lc-final-geral`

### 8.2 Controle de LC

Tela principal de listagem e gestão de desenhos técnicos, contendo:

- Campo de busca por OS, cliente ou equipamento;
- Cards/listagem com status visual: **Rascunho**, **Aguardando**, **Aprovado**, **Reprovado**;
- Informações de cliente, equipamento e data de recebimento;
- Ações conforme perfil: **Nova LC**, **Editar**, **Excluir** e **Ver**;
- Cabeçalho com identificação do usuário e papel (ex.: Desenho).

**Rota no sistema:** `/controle-lc`

> As telas acima correspondem ao protótipo funcional disponível neste repositório. Para executar localmente, consulte [instalacao-e-deploy.md](./instalacao-e-deploy.md).

---

## 9. Requisitos Funcionais

| RF | Título | Descrição |
| -- | ------ | --------- |
| RF01 | Cadastro de usuários | O sistema deve permitir o cadastro de usuários com perfis distintos (Desenhista, Aprovador, PCP, Gerência). |
| RF02 | Autenticação de usuários | O sistema deve permitir login com usuário e senha. |
| RF03 | Cadastro de desenhos técnicos | O desenhista deve poder cadastrar novos desenhos técnicos com informações como código, descrição, versão, data, etc. |
| RF04 | Edição de desenhos técnicos | O desenhista deve poder editar desenhos enquanto estiverem pendentes ou reprovados. |
| RF05 | Envio para aprovação | O sistema deve permitir que o desenhista envie o desenho para análise/aprovação. |
| RF06 | Aprovação/Reprovação de desenhos | O aprovador deve poder aprovar ou reprovar desenhos cadastrados. |
| RF07 | Registro de justificativa de reprovação | Ao reprovar, o sistema deve permitir que o aprovador informe o motivo. |
| RF08 | Notificação de status | O sistema deve notificar visualmente o desenhista sobre aprovação ou reprovação. |
| RF09 | Visualização de status dos desenhos | O sistema deve exibir o status dos desenhos (pendente, aprovado, reprovado). |
| RF10 | Consulta de desenhos aprovados | O setor PCP deve visualizar apenas desenhos aprovados. |
| RF11 | Marcação de produção (PCP) | O PCP deve poder marcar se o desenho foi programado para fabricação. |
| RF12 | Acompanhamento gerencial | A gerência deve visualizar todos os desenhos e seus status em tempo real. |
| RF13 | Histórico de alterações (rastreabilidade) | O sistema deve manter histórico de alterações e decisões (quem aprovou, quando, mudanças feitas). |
| RF14 | Filtro e busca | O sistema deve permitir buscar desenhos por código, status, data ou responsável. |

### 9.1 Requisitos Não Funcionais

| RNF | Título | Descrição |
| --- | ------ | --------- |
| RNF01 | Usabilidade | O sistema deve possuir interface simples e intuitiva para usuários de diferentes setores. |
| RNF02 | Desempenho | O sistema deve responder às ações do usuário em até 3 segundos. |
| RNF03 | Segurança | O sistema deve garantir controle de acesso baseado em perfil de usuário. |
| RNF04 | Disponibilidade | O sistema deve estar disponível pelo menos 95% do tempo. |
| RNF05 | Integridade dos dados | O sistema deve garantir que os dados não sejam perdidos ou corrompidos. |
| RNF06 | Escalabilidade | O sistema deve suportar aumento de usuários e volume de desenhos sem perda de desempenho. |
| RNF07 | Compatibilidade | O sistema deve funcionar nos principais navegadores (Chrome, Edge, etc.). |
| RNF08 | Auditoria | Todas as ações relevantes devem ser registradas (logs). |
| RNF09 | Manutenibilidade | O sistema deve ser estruturado de forma a facilitar a manutenção e evolução. |
| RNF10 | Confiabilidade | O sistema deve garantir consistência nas informações exibidas para todos os usuários. |

---

## 10. Referências

ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. **NBR ISO 9001:** Sistemas de Gestão da Qualidade — Requisitos. Rio de Janeiro: ABNT, 2015.

CORRÊA, Henrique Luiz; GIANESI, Irineu Gustavo Nogueira; CAON, Mauro. **Planejamento, programação e controle da produção:** MRP II/ERP. 6. ed. São Paulo: Atlas, 2019.

GIL, Antônio Carlos. **Como elaborar projetos de pesquisa.** 5. ed. São Paulo: Atlas, 2017.

LAUDON, Kenneth C.; LAUDON, Jane P. **Sistemas de informação gerenciais.** 15. ed. São Paulo: Pearson, 2021.

PRODANOV, Cleber C.; FREITAS, Enio C. de. **Metodologia do trabalho científico:** métodos e técnicas da pesquisa e do trabalho acadêmico. 2. ed. Novo Hamburgo: Feevale, 2013.

ROZENFELD, Henrique et al. **Gestão de desenvolvimento de produtos:** uma referência para a melhoria do processo. São Paulo: Saraiva, 2006.

SLACK, Nigel; BRANDON-JONES, Alistair; JOHNSTON, Robert. **Administração da produção.** 8. ed. São Paulo: Atlas, 2018.

SOMMERVILLE, Ian. **Engenharia de software.** 10. ed. São Paulo: Pearson, 2019.
