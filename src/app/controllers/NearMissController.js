/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
import 'dotenv/config';
import { resolve } from 'path';
import fs from 'fs';
import {parseISO} from 'date-fns';

import api from '../../config/api';

class NearMissController {
  /**
   * THIS ROUTE RECORDS ALL NEAR MISSES FROM LOGICS
   */
  async index(req, res) {

    const { year } = req.params;

    if(year) {
      console.log('Route accessed');

      const fullYear = `${year}-01-01T00:00:00Z`;

      const logicsAllURL = `${process.env.NEARMISS_DATA}&$filter=DateaTimeOccur ge ${fullYear}`
      const logicsCountAll = `${process.env.NEARMISS_COUNT}&$filter=DateaTimeOccur ge ${fullYear}`

      const logicsData = await api
      .get(logicsCountAll)
      .then(response => response);

      const NearmissQuantitity = logicsData.data['@odata.count'];

    // Get BBS pages based into 500 records limit by page
    const pages = Math.round(NearmissQuantitity / 500);

    console.log(`You have ${pages} to extract...`);
    console.log(`Beggining...`);

      return res.status(200).json({
        data: fullYear,
        URL: logicsAllURL,
        Quantity: NearmissQuantitity
      });

    }



    let start_time = new Date().getTime();

    const logicsData = await api
      .get(process.env.NEARMISS_COUNT)
      .then(response => response);

    const NearmissQuantitity = logicsData.data['@odata.count'];

    // Get BBS pages based into 500 records limit by page
    const pages = Math.round(NearmissQuantitity / 500);

    console.log(`You have ${pages} to extract...`);
    console.log(`Beggining...`);

    // For loop to record every single page listed
    for (let index = 0; index <= pages; index++) {
      const paginationData = await api
        .get(process.env.NEARMISS_DATA + Number(index) * 500)
        .then(response => response);

        // starts the stream
      const writeStream = fs.createWriteStream(
        `${resolve(__dirname, '..', '..', '..', 'tmp', 'NearMisses')}/nearmiss-${index}.json`
      );
      // write near miss data
      writeStream.write(JSON.stringify(paginationData.data.value, null));

      // the finish event is emitted when all data has been flushed from the stream
      writeStream.on('finish', () => {
        console.log(`page ${index} was wrote`);
        console.log('Time elapsed:', (new Date().getTime() - start_time) / 60 );
      });

      // close the stream
      writeStream.end();
    }

    return res.send('Finished');

}


}

export default new NearMissController();
