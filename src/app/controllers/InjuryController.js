/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
import 'dotenv/config';
import { resolve } from 'path';
import fs from 'fs';
import api from '../../config/api';

class InjuryController {
  /**
   * THIS ROUTE LIST ALL DATA INTO BBS RECORDS INTO LOGICS
   */

  async index(req, res) {
    const logicsData = await api
      .get(process.env.INJURY_COUNT)
      .then(response => response);

    const BBSQuantity = logicsData.data['@odata.count'];

    // Get BBS pages based into 500 records limit by page
    const pages = Math.round(BBSQuantity / 500);

    console.log(`You have ${pages} to extract...`);
    console.log(`Beggining...`);

    for (let index = 0; index <= 0; index++) {
      const paginationData = await api
        .get(process.env.INJURY_DATA + Number(index) * 500)
        .then(response => response);

      const writeStream = fs.createWriteStream(
        `${resolve(__dirname, '..', '..', '..', 'tmp')}/injury-${index}.txt`
      );
      // write some data with a base64 encoding
      writeStream.write(JSON.stringify(paginationData.data.value, null));

      // the finish event is emitted when all data has been flushed from the stream
      writeStream.on('finish', () => {
        console.log(`page ${index} was wrote`);
      });

      // close the stream
      writeStream.end();
    }

    return res.send('Finished');
  }

  async download(req, res) {
    // eslint-disable-next-line prefer-destructuring
    const start = req.params.start;

    res.download(
      `${resolve(__dirname, '..', '..', '..', 'tmp')}/injury-${start}.json`
    );
  }
}

export default new InjuryController();
