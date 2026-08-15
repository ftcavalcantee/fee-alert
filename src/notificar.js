require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

function enviarAlertar(mensagem) {
  bot.sendMessage(process.env.TELEGRAM_CHAT_ID, mensagem)
    .then(() => console.log('✅ Mensagem enviada com sucesso pro Telegram'))
    .catch((erro) => console.error('❌ Erro ao enviar pro Telegram:', erro.message));
}

module.exports = { enviarAlertar };