import { create } from 'apisauce';

import auth from '../../config/authLOGICS';

class BcmController {
  /**
   * THIS ROUTE LIST ALL DATA INTO BBS RECORDS INTO LOGICS
   */

  async index(req, res) {
    // Inform that route has been accessed
    console.log('BBS Route accesssed');

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
    });

    // Return data
    const logicsData = await api
      .get('/object/BehBasSaf_BBSObject?$count=true')
      .then(response => response);

    // Check if is a valid Authorization
    if (!logicsData.ok)
      return res.status(400).json({
        logicsData,
      });

    // Get BBS Quantity
    const BBSQuantity = logicsData.data['@odata.count'];

    // Get BBS pages based into 500 records limit by page
    const pages = Math.round(BBSQuantity / 500);

    // Variable to append all the pages into a single array
    let allBBS = [];

    // append data into a array to return to Power BI
    for (i = 1; i <= pages; i++) {
      allBBS.push(logicsData.data.value);
      console.log(`Page ${i} has been extracted`);
    }

    // return data for user
    return res.status(200).json(allBBS);
  }
}

export default new BcmController();
