/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
import 'dotenv/config';
import { resolve } from 'path';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import fs from 'fs';

import api from '../../config/api';
import Queue from '../../lib/Queue';
import FinishMail from '../jobs/FinishMail';

class InjuryController {
  /**
   * THIS ROUTE RECORDS ALL INJURIES FROM LOGICS
   */
  async index(req, res) {
    const { year } = req.params;
    let logicsAllURL = '';
    let logicsCountAll = '';
    let writeStream = '';

    console.log('Injury Route accessed');

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

    const emailData = {
      date: formattedDate,
      data: 'Injury Incidents',
      value: InjuryQuantity,
      pagesExported: pages,
      url: logicsAllURL,
      provider: 'System Admin',
      email: 'fabriciofrocha87@gmail.com',
    };

    console.log(`You have ${pages} to extract...`);
    console.log(`Beggining...`);

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
          console.log(`page ${index} was wrote`);
        });

        // close the stream
        writeStream.end();
      } catch (err) {
        console.log(err);
      }
    }

    await Queue.add(FinishMail.key, {
      emailData,
    });

    return res.send('Finished');
  }
}

export default new InjuryController();
