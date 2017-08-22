import express from 'express';

/**
 * imports custom module
 */
import appMiddleware from './config/app.middleware';
import constants from './config/constants';
import './config/database';

const app = express();

appMiddleware(app);

app.listen(constants.PORT, () => {
	console.log(`Server is running on port: ${constants.PORT}`);
});

export default app;
