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

class NearMissController {
  /**
   * THIS ROUTE RECORDS ALL MASTER INCIDENT FROM LOGICS
   */
  async index(req, res) {
    const { year } = req.params;
    let logicsAllURL = '';
    let logicsCountAll = '';
    let writeStream = '';

    console.log('Near Miss Route accessed');

    if (year) {
      const fullYear = `${year}-01-01T00:00:00Z`;

      logicsAllURL = `${process.env.NEARMISS_DATA}&$filter=DateofOccurence ge ${fullYear} and Deleted eq false and IncidTypeHelper eq 'Near Miss / Hazard Report'`;
      logicsCountAll = `${process.env.NEARMISS_COUNT}&$filter=DateofOccurence ge ${fullYear} and Deleted eq false and IncidTypeHelper eq 'Near Miss / Hazard Report'`;
    }
    if (!year) {
      logicsCountAll = `${process.env.NEARMISS_COUNT}&$filter=Deleted eq false and IncidTypeHelper eq 'Near Miss / Hazard Report'`;
      logicsAllURL = `${process.env.NEARMISS_DATA}&$filter=Deleted eq false and IncidTypeHelper eq 'Near Miss / Hazard Report'`;
    }

    const logicsData = await api.get(logicsCountAll).then(response => response);

    const NearMissQuantity = logicsData.data['@odata.count'];

    // Get BBS pages based into 500 records limit by page
    const pages = Math.round(NearMissQuantity / 500);

    const formattedDate = format(new Date(), "dd 'de' MMMM', às ' H:mm'h'", {
      locale: pt,
    });

    const emailData = {
      date: formattedDate,
      data: 'Near Miss Incidents',
      value: NearMissQuantity,
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
              'NearMiss',
              year
            )}/nearmiss-${index}.txt`
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
              'NearMiss',
              'All'
            )}/nearmiss-${index}.txt`
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

export default new NearMissController();
