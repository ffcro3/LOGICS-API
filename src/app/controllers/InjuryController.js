import 'dotenv/config';
import fileDownload from 'js-file-download';
import { create } from 'apisauce';
import api from '../../config/api'
import fs from 'fs';


import auth from '../../config/authLOGICS';

class InjuryController {
  /**
   * THIS ROUTE LIST ALL DATA INTO BBS RECORDS INTO LOGICS
   */

  async index(req, res) {
    // Inform that route has been accessed
    console.log('Injury Route accesssed');

    // Page params for requests
    const { page } = req.params;

    // Variable for loop
    let i = null;

    // Variable to append all the pages into a single array
    const allInjuries = [];

    console.log(process.env.INJURY_DATA + (Number(page) * 500));
      
      const paginationData = await api
      .get(process.env.INJURY_DATA + (Number(page) * 500) )
      .then(response => response);

      await fs.writeFile(`injury-${Number(page)}.json`, JSON.stringify(paginationData.data.value, null), (err) => {
        if (err) return res.status(500).json({
          error: 'file not saved'
        })
      })

      await res.download(`injury-${Number(page)}.json`, `injury-${page}.json`, (err) => {
        if (err) return res.status(500).json({
          error: 'file not dwonloaded'
        })
      });

      
      res.json({
        data: true
      });
  }

}

export default new InjuryController();
