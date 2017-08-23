import express from 'express';

/**
 * imports custom module
 */
import appMiddleware from './config/app.middleware';
import routes from './modules/index';
import constants from './config/constants';
import './config/database';

const app = express();

appMiddleware(app);
routes(app);

app.listen(constants.PORT, () => {
	console.log(`Server is running on port: ${constants.PORT}`);
});

export default app;
