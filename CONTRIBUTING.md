# Contribuindo para o Projeto

Este documento descreve as diretrizes e boas práticas para contribuições **internas**, garantindo qualidade, consistência e manutenibilidade do código ao longo do desenvolvimento.

> **Escopo**: Este projeto é um **frontend em React**, mantido pela **equipe de desenvolvimento interna** do SIGAS. As regras aqui descritas devem ser seguidas por todos os membros da equipe.

---

## Objetivo deste documento

Este guia tem caráter **educacional** e busca:
- Padronizar a forma como contribuímos
- Facilitar revisões de código
- Manter o projeto sustentável e evolutivo
- Reduzir retrabalho e dívida técnica

---

## Organização geral do projeto

- O projeto já possui um **README.md** com instruções para execução local
- Este documento foca **exclusivamente** no processo de contribuição

---

## Fluxo de trabalho (Git)

### Branch principal
- A branch principal é: **`main`**
- **Não** faça commits diretos nela, a não ser que sejam pequenas alterações "não significativas"

### Estratégia de branches

> ⚠️ A estratégia de branches ainda está **em discussão** pela equipe.

---

## Pull Requests (PR)

### Quando abrir um PR

- **Obrigatório** para mudanças grandes
- Recomendado para qualquer alteração que:
  - Afete regras de negócio
  - Modifique componentes reutilizáveis
  - Altere estrutura ou arquitetura

### Requisitos para PR

Antes de solicitar revisão, certifique-se de que:

- [ ] O código segue os padrões definidos neste documento
- [ ] O CI passou com sucesso
- [ ] Não há código morto ou comentado
- [ ] Não há duplicação desnecessária
- [ ] Componentes e funções possuem responsabilidade clara

---

## Testes

- Testes **não são obrigatórios**, mas são **fortemente recomendados**
- Sempre que possível:
  - Teste componentes reutilizáveis
  - Teste regras de negócio

O objetivo não é cobertura máxima, mas **confiança no código**.

---

## Nomes de arquivos de código

Nomeie o seu componente ou seu código com a sua função ou o que ele faz.

---

## Padrões de código

### Princípios gerais

Todo código novo ou alterado deve buscar:

- Código **limpo e legível**
- **Reutilização** de componentes e funções
- **Baixa duplicidade**
- Clareza acima de complexidade

### Princípios SOLID

Sempre que aplicável, siga os princípios SOLID:

- **S** — Single Responsibility: uma função/componente deve ter um único propósito
- **O** — Open/Closed: aberto para extensão, fechado para modificação
- **L** — Liskov Substitution: componentes devem ser intercambiáveis sem quebrar o sistema
- **I** — Interface Segregation: evite interfaces genéricas demais
- **D** — Dependency Inversion: dependa de abstrações, não de implementações concretas

> 💡 Nem todo componente precisa aplicar todos os princípios, mas eles devem guiar decisões arquiteturais.

---

## Padrão de commits

Utilizamos **Conventional Commits**.

### Estrutura
```text
tipo: descrição curta
```

### Tipos mais comuns
- `feat`: nova funcionalidade
- `fix`: correção de bug
- `chore`: tarefas técnicas
- `refactor`: refatoração sem mudança de comportamento
- `docs`: documentação
- `test`: testes

### Exemplos
```text
feat: adicionar login com Google
fix: corrigir quebra no mobile
refactor: simplificar lógica de variantes
```

---

## Issues

- O fluxo principal de tarefas ocorre via **integração com o Trello**
- Eventualmente, issues podem ser abertas diretamente no repositório

Ao abrir uma issue no Git, descreva claramente:
- O problema ou objetivo
- Contexto
- Comportamento esperado

---

## Integração Contínua (CI)

- O **CI deve passar obrigatoriamente** antes do merge
- PRs com falha no CI **não devem ser aprovados**

O CI existe para proteger a base de código e evitar algum problema na base principal do código.

---

## 🚀 Criação de Releases

A criação de releases tem como objetivo **versionar entregas**, facilitar rollback e manter um histórico claro de evolução do projeto.

### Quando criar uma release

Uma release deve ser criada quando:

* Um conjunto de funcionalidades estiver estável
* Correções relevantes forem entregues
* Houver impacto direto para usuários

### Versionamento

Utilizamos **Semantic Versioning (SemVer)**:

```
MAJOR.MINOR.PATCH
```

* **MAJOR**: mudanças incompatíveis
* **MINOR**: novas funcionalidades compatíveis
* **PATCH**: correções de bugs

Exemplos:

* `1.0.0`
* `1.2.0`
* `1.2.3`

### Passo a passo para criar uma release

1. Garantir que a branch `main` esteja atualizada e estável
2. Confirmar que todos os PRs incluídos:

   * Foram revisados
   * Passaram no CI
3. Defina a nova versão seguindo o SemVer
4. Crie uma **tag** apontando para o commit correto
5. Publique a release no repositório

### Notas da release (Release Notes)

As release notes devem ser claras e objetivas, contendo:

* Novas funcionalidades
* Correções
* Refatorações relevantes
* Breaking changes (se houver)

Exemplo:

* Adicção de fluxo de autenticação
* Correção de erro no layout mobile
* componente de botão reescrito

### Boas práticas

* Não crie releases diretamente de branches de feature
* Evite incluir código não utilizado e comentado
* Prefira releases pequenas e frequentes

---


## Código de conduta

Atualmente, o projeto **não possui um Código de Conduta formal**.

Ainda assim, espera-se de todos os contribuidores:
- Respeito
- Comunicação clara
- Feedback construtivo

---

## Licença

A licença do projeto ainda **não foi definida**.

Até que isso ocorra, o código é considerado de **uso interno**.

---

## Considerações finais

Obrigado por contribuir!

