const { buscarTaxa } = require('./api');
const { salvar, buscarUltimas24h } = require('./database');
const { calcularMedia } = require('./calculo');
const cron = require('node-cron');
const { deveAlertar } = require('./alerta');
const THRESHOLD = 5; // sat/vB
const { enviarAlertar } = require('./notificar');

async function rodar() {
  const dados = await buscarTaxa();
  const agora = new Date().toISOString();

  salvar(agora, dados.hourFee);

  const registros = buscarUltimas24h();
  const media = calcularMedia(registros);

  if (media !== null) {
    const economia = ((media - dados.hourFee) / media) * 100;
    console.log(agora, `atual: ${dados.hourFee} | media: ${media.toFixed(1)} | economia: ${economia.toFixed(0)}%`);
  } else {
    console.log(agora, `atual: ${dados.hourFee} | ainda sem historico`);
  }

  if (deveAlertar(dados.hourFee, THRESHOLD)) {
    const mensagem = `🔔 Taxa está em ${dados.hourFee} sat/vB — abaixo do seu limite de ${THRESHOLD}!`;
    console.log(mensagem);
    enviarAlertar(mensagem);
  }
}

cron.schedule('*/10 * * * *', rodar);
rodar();