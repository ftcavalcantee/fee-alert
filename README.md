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

## Como funciona

1. Busca a taxa atual na API do mempool.space a cada 10 minutos.
2. Salva o valor no histórico (SQLite).
3. Calcula a média, mínima e máxima das últimas 24h.
4. Compara a taxa atual com esse histórico.
5. Se a taxa cruzar o limite definido pelo usuário, dispara um alerta via Telegram.
6. Mostra tudo numa tela web simples, com gráfico e explicação do que é sat/vB.

## Stack

- **Backend:** Node.js
- **Banco de dados:** SQLite (better-sqlite3)
- **Frontend:** HTML/CSS/JS puro + Chart.js
- **Notificação:** Telegram Bot API
- **Agendamento:** node-cron

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

