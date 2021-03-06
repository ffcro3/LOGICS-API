/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
import 'dotenv/config';
import { resolve } from 'path';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import fs from 'fs';
import Telegraf from 'telegraf';

import api from '../services/api';

class InjuryController {
  /**
   * THIS ROUTE RECORDS ALL INJURIES FROM LOGICS
   */
  async index(req, res) {
    const { year } = req.params;
    let logicsAllURL = '';
    let logicsCountAll = '';
    let writeStream = '';
    const bot = new Telegraf(process.env.POWERBI_TOKEN);

    bot.telegram.sendMessage(
      process.env.TELEGRAM_CHAT,
      'Injury route accessed'
    );

    if (year) {
      const fullYear = `${year}-01-01T00:00:00Z`;

      logicsAllURL = `${process.env.INJURY_DATA}&$filter=DateOccurenceH ge ${fullYear} and Deleted eq false`;
      logicsCountAll = `${process.env.INJURY_COUNT}&$filter=DateOccurenceH ge ${fullYear} and Deleted eq false`;
    }
    if (!year) {
      logicsCountAll = `${process.env.INJURY_COUNT}&$filter=Deleted eq false`;
      logicsAllURL = `${process.env.INJURY_DATA}&$filter=Deleted eq false`;
    }

    const logicsData = await api.get(logicsCountAll).then(response => response);

    const InjuryQuantity = logicsData.data['@odata.count'];

    // Get BBS pages based into 500 records limit by page
    const pages = Math.round(InjuryQuantity / 500);

    const formattedDate = format(new Date(), "dd 'de' MMMM', às ' H:mm'h'", {
      locale: pt,
    });

    bot.telegram.sendMessage(
      process.env.TELEGRAM_CHAT,
      `You have ${pages} to extract`
    );

    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT, `Beggining...`);

    // For loop to record every single page listed
    for (let index = 0; index <= pages; index++) {
      try {
        const paginationData = await api
          .get(`${logicsAllURL}&$skip=${Number(index) * 500}`)
          .then(response => response);

        if (year) {
          // starts the stream
          writeStream = fs.createWriteStream(
            `${resolve(
              __dirname,
              '..',
              '..',
              '..',
              'tmp',
              'Injuries',
              year
            )}/injury-${index}.txt`
          );
        }
        if (!year) {
          // starts the stream
          writeStream = fs.createWriteStream(
            `${resolve(
              __dirname,
              '..',
              '..',
              '..',
              'tmp',
              'Injuries',
              'All'
            )}/injury-${index}.txt`
          );
        }
        // write master incident data
        writeStream.write(JSON.stringify(paginationData.data.value, null));

        // the finish event is emitted when all data has been flushed from the stream
        writeStream.on('finish', () => {
          bot.telegram.sendMessage(
            process.env.TELEGRAM_CHAT,
            `Page ${index} was wrote`
          );
        });

        // close the stream
        writeStream.end();
      } catch (err) {
        console.log(err);
      }
    }

    bot.telegram.sendMessage(
      process.env.TELEGRAM_CHAT,
      `Injury routine has FINISHED at ${formattedDate}`
    );

    return res.send('Finished');
  }
}

export default new InjuryController();
