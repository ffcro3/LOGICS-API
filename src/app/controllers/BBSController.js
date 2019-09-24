import { create } from 'apisauce';

import auth from '../../config/authLOGICS';

class BcmController {
  /**
   * THIS ROUTE LIST ALL DATA INTO BBS RECORDS INTO LOGICS
   */

  async index(req, res) {
    // Inform that route has been accessed
    console.log('Injury Route accesssed');

    // Page params for requests
    const finalPage = req.params.finalPage;
    const initialPage = req.params.initialPage;

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
      .get('https://global.intelex.com/Login3/LOGICS/api/v2/object/SafetIncidentv6_SSafetyIncidentObject?$select=DateOccurenceH,TimofOccurrence,ShiftStartTime,ShiftEndTime,HrsAtTimeofAcc,DateCreated,IncidenRecordNo,InjurePartyName,WhatObjHarmed,DateOfBirth,DayAwayFromWork,DaysJobTransfer,InjuWorkRelated,Deleted&$expand=CreatedBy($select=Name),Location($select=Name),hciMasterIncide($select=IncidentNo),CategoryID($select=Caption),Function($select=Caption),DHLInjPartyType($select=Caption),CausationType($select=Caption),SubIncidentType($select=Caption),DHLBodyPart($select=Caption),Workflow($select=DueDateType,WorkflowStatus)&$count=true')
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

    console.log(`You have ${pages} pages to extract`);

    console.log(`Beggining extraction...`);

    // append data into a array to return to Power BI
    for (i = initialPage; i <= finalPage; i++) {

      const paginationData = await api
      .get(`object/SafetIncidentv6_SSafetyIncidentObject?$select=DateOccurenceH,TimofOccurrence,ShiftStartTime,ShiftEndTime,HrsAtTimeofAcc,DateCreated,IncidenRecordNo,InjurePartyName,WhatObjHarmed,DateOfBirth,DayAwayFromWork,DaysJobTransfer,InjuWorkRelated,Deleted&$expand=CreatedBy($select=Name),Location($select=Name),hciMasterIncide($select=IncidentNo),CategoryID($select=Caption),Function($select=Caption),DHLInjPartyType($select=Caption),CausationType($select=Caption),SubIncidentType($select=Caption),DHLBodyPart($select=Caption),Workflow($select=DueDateType,WorkflowStatus)&$skip=${i*500}`)
      .then(response => response);

      allBBS.push(paginationData.data.value);
      console.log(`Page ${i} has been extracted`);
    }


    console.log(`Request has been finished... Go to Power BI and Refresh the data.`);
    // return data for user
    return res.status(200).json(allBBS);
    

  }
}

export default new BcmController();
