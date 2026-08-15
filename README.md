# Fee Alert

## O Problema

Pessoas que enviam Bitcoin de vez em quando não querem ficar monitorando a taxa da rede o dia inteiro pra pegar o momento mais barato.

## Quem tem esse problema?

- Usuários comuns de Bitcoin (não é preciso ser expert).
- Pessoas que fazem transações que não são urgentes (podem esperar horas/dias).
- Pequenas empresas ou exchanges que querem otimizar custo operacional.

## Por que isso acontece?

A taxa da rede Bitcoin (sat/vB) varia bastante ao longo do dia, dependendo do congestionamento da mempool. Sem uma ferramenta, a pessoa só descobre isso "chutando" ou checando manualmente em sites como mempool.space.

## Nossa Solução

Um serviço que monitora a taxa da rede continuamente, compara com o histórico recente e avisa o usuário quando a taxa está barata (abaixo de um limite definido por ele).

**Objetivo:** economizar dinheiro em taxas, sem precisar ficar checando manualmente.

## Input

O usuário fornece:

- Threshold desejado (ex: "avise quando ficar abaixo de 10 sat/vB").
- Canal de notificação (email, Telegram, etc).

## Process

1. Busca a taxa atual na API do mempool.space, periodicamente.
2. Salva o valor no histórico (banco de dados).
3. Calcula a média das últimas 24h.
4. Compara a taxa atual com essa média.
5. Se a taxa atual cruzar o threshold do usuário, dispara o alerta.

## Output

- Taxa atual (sat/vB).
- Comparação com a média recente (ex: "60% abaixo da média das últimas 24h").
- Notificação quando a condição do usuário for atingida.

## Valor

O usuário para de checar manualmente a taxa da rede e economiza dinheiro esperando o momento certo pra enviar sua transação.

## Fonte de dados

API pública e gratuita do [mempool.space](https://mempool.space):

```
GET https://mempool.space/api/v1/fees/recommended
```

Retorna:

```json
{
  "fastestFee": 4,
  "halfHourFee": 3,
  "hourFee": 1,
  "economyFee": 1,
  "minimumFee": 1
}
```

## Status do projeto

🚧 Em fase de definição da ideia — próximo passo é a arquitetura técnica.