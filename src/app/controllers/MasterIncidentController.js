/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
import 'dotenv/config';
import { resolve } from 'path';
import fs from 'fs';

import api from '../../config/api';

class MasterIncidentController {
  /**
   * THIS ROUTE RECORDS ALL MASTER INCIDENT FROM LOGICS
   */
  async index(req, res) {
    const { year } = req.params;
    let logicsAllURL = '';
    let logicsCountAll = '';
    let writeStream = '';

    console.log('Master Route accessed');

    if (year) {
      const fullYear = `${year}-01-01T00:00:00Z`;

      logicsAllURL = `${process.env.MASTER_DATA}&$filter=DateaTimeOccur ge ${fullYear} and Deleted eq false`;
      logicsCountAll = `${process.env.MASTER_COUNT}&$filter=DateaTimeOccur ge ${fullYear} and Deleted eq false`;
    }
    if (!year) {
      logicsCountAll = `${process.env.MASTER_COUNT}&$filter=Deleted eq false`;
      logicsAllURL = `${process.env.MASTER_DATA}&$filter=Deleted eq false`;
    }

    const logicsData = await api.get(logicsCountAll).then(response => response);

    const MasterQuantity = logicsData.data['@odata.count'];

    // Get BBS pages based into 500 records limit by page
    const pages = Math.round(MasterQuantity / 500);

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
              'MasterIncident',
              year
            )}/master-${index}.txt`
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
              'MasterIncident',
              'All'
            )}/master-${index}.txt`
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

    return res.send('Finished');
  }
}

export default new MasterIncidentController();
