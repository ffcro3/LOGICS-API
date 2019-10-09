import 'dotenv/config';
import Telegraf from 'telegraf';

import api from '../services/api';

class InjuryTelegram {
  // THIS METHOD GETS ALL INJURIES FROM CURRENT YEAR
  async thisYear() {
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

    const year = new Date().getFullYear();
    const query = `$select=IncidentNo&$count=true&$filter=Deleted eq false and IncidTypeHelper eq 'Near Miss / Hazard Report' and Location/DHLCountry eq 'Brazil' and DateCreated ge ${year}-01-01T00:00:00Z`;
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT, 'Aguarde ...');
    const brasilInjuries = await api.get(
      `${process.env.NEARMISS_CLEAR}${query}`
    );

    const totalInjuries = brasilInjuries.data['@odata.count'];

    return bot.telegram.sendMessage(
      process.env.TELEGRAM_CHAT,
      `Neste ano, houveram um total de ${totalInjuries} near misses no Brasil`
    );
  }

  // THIS METHOD GETS ALL INJURIES FROM LAST YEAR
  async lastYear() {
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
    const year = new Date().getFullYear() - 1;
    const query = `$select=IncidentNo&$count=true&$filter=Deleted eq false and IncidTypeHelper eq 'Near Miss / Hazard Report' and Location/DHLCountry eq 'Brazil' and DateCreated ge ${year}-01-01T00:00:00Z`;
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT, 'Aguarde ...');
    const brasilInjuries = await api.get(
      `${process.env.NEARMISS_CLEAR}${query}`
    );

    const totalInjuries = brasilInjuries.data['@odata.count'];

    return bot.telegram.sendMessage(
      process.env.TELEGRAM_CHAT,
      `No ano de ${year}, houveram um total de ${totalInjuries} near misses no Brasil.`
    );
  }

  // THIS METHOD GETS ALL INJURIES FROM CURRENT MONTH
  async thisMonth() {
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
    const year = new Date().getFullYear();
    const month =
      new Date().getMonth() + 1 < 10
        ? `0${new Date().getMonth() + 1}`
        : new Date().getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate();
    const query = `$select=IncidentNo&$count=true&$filter=Deleted eq false and IncidTypeHelper eq 'Near Miss / Hazard Report' and DateCreated ge ${year}-${month}-01T00:00:00Z and DateCreated le ${year}-${month}-${lastDay}T23:59:59Z and Location/DHLCountry eq 'Brazil'`;

    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT, 'Aguarde ...');
    const brasilInjuries = await api.get(
      `${process.env.NEARMISS_CLEAR}${query}`
    );

    const totalInjuries = brasilInjuries.data['@odata.count'];

    return bot.telegram.sendMessage(
      process.env.TELEGRAM_CHAT,
      `Neste mês, houveram um total de ${totalInjuries} near misses no Brasil.`
    );
  }

  // THIS METHOD GETS ALL INJURIES FROM CURRENT MONTH
  async lastMonth() {
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
    const year = new Date().getFullYear();
    const month =
      new Date().getMonth() < 10
        ? `0${new Date().getMonth()}`
        : new Date().getMonth();
    const lastDay = new Date(year, month, 0).getDate();
    const query = `$select=IncidentNo&$count=true&$filter=Deleted eq false and IncidTypeHelper eq 'Near Miss / Hazard Report' and DateCreated ge ${year}-${month}-01T00:00:00Z and DateCreated le ${year}-${month}-${lastDay}T23:59:59Z and Location/DHLCountry eq 'Brazil'`;

    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT, 'Aguarde ...');
    const brasilInjuries = await api.get(
      `${process.env.NEARMISS_CLEAR}${query}`
    );

    const totalInjuries = brasilInjuries.data['@odata.count'];

    return bot.telegram.sendMessage(
      process.env.TELEGRAM_CHAT,
      `No mês anterior, houveram um total de ${totalInjuries} near misses no Brasil.`
    );
  }
}

export default new InjuryTelegram();
