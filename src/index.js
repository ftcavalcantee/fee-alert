const { buscarTaxa } = require('./api');
const { salvar, buscarUltimas24h } = require('./database');
const { calcularMedia } = require('./calculo');
const cron = require('node-cron');
const { deveAlertar } = require('./alerta');
const { enviarAlerta } = require('./notificar');
const THRESHOLD = 5; // sat/vB

async function buscarPrecoBTC() {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl,usd');
  const dados = await res.json();
  return dados.bitcoin;
}

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
    const TAMANHO_TX_VB = 180;
    const precoBTC = await buscarPrecoBTC();

    const custoAgora = (dados.hourFee * TAMANHO_TX_VB / 100000000) * precoBTC.brl;
    const custoMedia = media !== null ? (media * TAMANHO_TX_VB / 100000000) * precoBTC.brl : null;
    const economiaMsg = custoMedia !== null ? ((custoMedia - custoAgora) / custoMedia) * 100 : null;

    const mensagem = `🔔 Bom momento para enviar Bitcoin!\n\n` +
      `Taxa atual: ${dados.hourFee} sat/vB\n` +
      `Custo estimado: R$ ${custoAgora.toFixed(2)}\n` +
      (economiaMsg !== null
        ? `💰 Economia de ${economiaMsg.toFixed(0)}% comparado à média das últimas 24h (R$ ${custoMedia.toFixed(2)})\n\n`
        : `\n`) +
      `💡 Bom momento pra confirmar rápido, pagando pouco.`;

    console.log(mensagem);
    enviarAlerta(mensagem);
  }
}

cron.schedule('*/10 * * * *', rodar);
rodar();