import { create } from 'apisauce';

import auth from '../../config/authLOGICS';

class BcmController {
  /**
   * THIS ROUTE LIST ALL DATA INTO BBS RECORDS INTO LOGICS
   */

  async index(req, res) {
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

    // append data into a array to return to Power BI
    for (i = 1; i < 2; i++) {
      console.log(i);
    }

    // return data for user
    return res.status(200).json(pages);
  }
}

export default new BcmController();
