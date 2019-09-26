import { Router } from 'express';

import InjuryController from './app/controllers/InjuryController';

const routes = new Router();

routes.get('/injury/:initialPage/:finalPage/', InjuryController.index);
routes.get('/injury/env', InjuryController.getEnv);

export default routes;
