const express = require('express');
const { buscarUltimas24h } = require('./database');

const app = express();

app.get('/api/historico', (req, res) => {
  const registros = buscarUltimas24h();
  res.json(registros);
});

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));