import 'dotenv/config';
import { create } from 'apisauce';

import auth from '../../config/authLOGICS';

class InjuryController {
  /**
   * THIS ROUTE LIST ALL DATA INTO BBS RECORDS INTO LOGICS
   */

  async index(req, res) {
    // Inform that route has been accessed
    console.log('Injury Route accesssed');

    // Page params for requests
    const { finalPage } = req.params;
    const { initialPage } = req.params;

    // Variable for loop
    let i = null;

    // defining API URL
    const api = create({
      baseURL: 'https://global.intelex.com/Login3/LOGICS/api/v2',
    });

    // Authorization Headers
    api.setHeaders({
      Authorization: `Basic ${Buffer.from(
        `${auth.username}:${auth.password}`
      ).toString('base64')}`,
      timeout: 10000000,
    });

    // Variable to append all the pages into a single array
    const allBBS = [];

    console.log(process.env.INJURY_DATA);

    // append data into a array to return to Power BI
    for (i = initialPage; i <= finalPage; i++) {
      const paginationData = await api
        .get(process.env.INJURY_DATA + i * 500)
        .then(response => response);

      allBBS.push(paginationData.data.value);

      console.log(`Page ${i} has been extracted`);
    }

    console.log(
      `Request has been finished... Go to Power BI and Refresh the data.`
    );
    // return data for user
    return res.status(200).json(allBBS);
  }

  async getEnv(req, res) {
    return res.status(200).json({
      Data: process.env.INJURY_DATA,
    });
  }
}

export default new InjuryController();
