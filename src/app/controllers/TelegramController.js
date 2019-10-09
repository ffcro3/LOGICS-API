import 'dotenv/config';
import Telegraf from 'telegraf';
import Markup from 'telegraf/markup';

import api from '../services/api';
import injuryData from './InjuryTelegram';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

console.log('LOGICS-DHL-API Bot Started');

bot.command('injury', ({ reply }) => {
  return reply(
    'Lesões',
    Markup.keyboard([
      ['Brasil - Injuries', 'Setor - Injuries'], // Row1 with 2 buttons
      ['Meu Site - Injuries', 'Outro Site - Injuries'], // Row2 with 2 buttons
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

bot.hears('Brasil - Injuries', ({ reply }) => {
  return reply(
    'Buscar lesões no Brasil',
    Markup.keyboard([
      ['Lesões no Brasil este ano', 'Lesões no Brasil este mês'], // Row1 with 2 buttons
      ['Lesões no Brasil ano passado', 'Lesões no Brasil em outra data'], // Row2 with 2 buttons
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

// SELEÇÃO DE DATAS PARA O BRASIL
bot.hears('Lesões no Brasil este ano', injuryData.thisYear);

bot.hears('Lesões no Brasil ano passado', injuryData.lastYear);

bot.hears('Lesões no Brasil este mês', injuryData.thisMonth);

bot.launch();
