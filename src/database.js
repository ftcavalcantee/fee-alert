const Database = require('better-sqlite3');
const db = new Database('fee-alert.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS historico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      hourFee INTEGER
    )
  `);

  function salvar(timestamp,hourFee){
    db.prepare('INSERT INTO historico (timestamp, hourFee) VALUES (?, ?)')
    .run(timestamp, hourFee);
  }

  function buscarUltimas24h(){
    const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    return db.prepare('SELECT timestamp, hourFee FROM historico WHERE timestamp >= ?').all(ontem);
  }

  module.exports = { salvar, buscarUltimas24h };