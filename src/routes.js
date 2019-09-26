import { Router } from 'express';

import InjuryController from './app/controllers/InjuryController';

const routes = new Router();

routes.get('/injury/:page/', InjuryController.index);

export default routes;
