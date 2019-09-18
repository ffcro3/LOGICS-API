import { Router } from 'express';

import BBSController from './app/controllers/BBSController';

const routes = new Router();

routes.get('/bbs/:initialPage/:finalPage', BBSController.index);

export default routes;
