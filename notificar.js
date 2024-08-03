require('dotenv').config();
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const { analisarSentimento } = require('./analisar_sentimento'); // Vamos criar este arquivo no próximo passo

const transporter = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY // Sua chave de API do SendGrid
  }
}));

async function notificarErro(erro) {
  try {
    const mensagem = erro; 
    const resultadoAnalise = await analisarSentimento(mensagem);
    const nivelDeUrgencia = resultadoAnalise.classificacao; // 'positivo', 'negativo', 'neutro'

    const mailOptions = {
      from: 'seu_email@example.com', 
      to: 'email_destinatario@example.com',
      subject: `[Teste Falhou] ${nivelDeUrgencia}`,
      text: `Houve um erro no teste:\n\n${mensagem}\n\nSentimento: ${resultadoAnalise.detalhes}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Erro ao enviar email:', error);
      } else {
        console.log('Email enviado:', info.response);
      }
    });
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
  }
}

module.exports = { notificarErro };