import { Router } from 'express';

import InjuryController from './app/controllers/InjuryController';

const routes = new Router();

routes.get('/injury/save', InjuryController.index);
routes.get('/injury/download/:start/', InjuryController.download);

export default routes;
