const express = require('express');
const { buscarUltimas24h } = require('./database');

const app = express();

app.get('/api/historico', (req, res) => {
  const registros = buscarUltimas24h();
  res.json(registros);
});

async function buscarPrecoBTC() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl,usd');
  const dados = await res.json();
  return dados.bitcoin; 
}

app.get('/api/custo', async (req, res) => {
  const registros = buscarUltimas24h();
  if (registros.length === 0) return res.json({ erro: 'sem dados'});

  const taxaAtual = registros[registros.length - 1].hourFee;
  const precoBTC = await buscarPrecoBTC();

  const TAMANHO_TX_VB = 180;
  
  const custoSatoshis = taxaAtual * TAMANHO_TX_VB;
  const custoBTC = custoSatoshis / 100000000;
  const custoBRL = custoBTC * precoBTC.brl;
  const custoUSD = custoBTC * precoBTC.usd;

  res.json({
    custoBRL: custoBRL.toFixed(2),
    custoUSD: custoUSD.toFixed(2)
  });
});


const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));