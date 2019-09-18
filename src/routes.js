import { Router } from 'express';

import BCMController from './app/controllers/bcmController';

const routes = new Router();

routes.get('/bbs', BCMController.index);

export default routes;
