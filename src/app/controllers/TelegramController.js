import 'dotenv/config';
import Telegraf from 'telegraf';
import Markup from 'telegraf/markup';

import injuryData from './InjuryTelegram';
import nearMissData from './NearMissTelegram';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

console.log('LOGICS-DHL-API Bot Started');

// INJURIES
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
      ['Lesões no Brasil este ano', 'Lesões no Brasil ano passado'], // Row1 with 2 buttons
      ['Lesões no Brasil este mês', 'Lesões no Brasil mês passado'], // Row2 with 2 buttons
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

bot.hears('Lesões no Brasil mês passado', injuryData.lastMonth);

// NEAR MISS
bot.command('near_miss', ({ reply }) => {
  return reply(
    'Near Misses',
    Markup.keyboard([
      ['Brasil - Near Misses', 'Setor - Near Misses'], // Row1 with 2 buttons
      ['Meu Site - Near Misses', 'Outro Site - Near Misses'], // Row2 with 2 buttons
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

bot.hears('Brasil - Near Misses', ({ reply }) => {
  return reply(
    'Buscar Near Misses no Brasil',
    Markup.keyboard([
      ['Near Misses no Brasil este ano', 'Near Misses no Brasil ano passado'],
      ['Near Misses no Brasil este mês', 'Near Misses no Brasil mês passado'], // Row2 with 2 buttons
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

// SELEÇÃO DE DATAS PARA O BRASIL
bot.hears('Near Misses no Brasil este ano', nearMissData.thisYear);

bot.hears('Near Misses no Brasil ano passado', nearMissData.lastYear);

bot.hears('Near Misses no Brasil este mês', nearMissData.thisMonth);

bot.hears('Near Misses no Brasil mês passado', nearMissData.lastMonth);

bot.launch();
