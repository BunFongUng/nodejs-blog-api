import mongoose from 'mongoose';
import config from './constants';

mongoose.Promise = global.Promise;

try {
	mongoose.connect(config.MONGODB_URL, {
		useMongoClient: true
	});
} catch (error) {
	mongoose.createConnection(config.MONGODB_URL, {
		useMongoClient: true
	});
}

mongoose.connection
	.once('open', () => console.log('MONGODB is running'))
	.on('error', err => {
		throw err;
	});
