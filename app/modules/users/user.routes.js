import { Router } from 'express';
// import validate from 'express-validation';

import * as userControllers from './user.controllers';
// import userValidation from './user.validation';

const route = new Router();

route.post('/signup', userControllers.signUp);

export default route;