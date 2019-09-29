import { Router } from 'express';

import InjuryController from './app/controllers/InjuryController';
import NearMissController from './app/controllers/NearMissController';
import MasterIncidentController from './app/controllers/MasterIncidentController';

const routes = new Router();

// INJURY
routes.get('/injury/save', InjuryController.index);
routes.get('/injury/save/:year', InjuryController.index);

// NEAR MISS
routes.get('/nearmiss/save', NearMissController.index);
routes.get('/nearmiss/save/:year', NearMissController.index);

// MASTER
routes.get('/master/save/', MasterIncidentController.index);
routes.get('/master/save/:year', MasterIncidentController.index);

export default routes;
