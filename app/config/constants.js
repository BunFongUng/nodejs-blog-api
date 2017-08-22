const env = process.env.NODE_ENV;
const port = process.env.PORT;

switch(env) {
	case 'production':
		process.env.MONGODB_URL = 'mongodb://localhost:27017/blogDatabase';
		break;
	case 'test':
		process.env.MONGODB_URL = 'mongodb://localhost:27017/blogDatabase-testing';
		break;
	default:
		process.env.MONGODB_URL = 'mongodb://localhost:27017/blogDatabase-dev';
		break;
}

export default {
	PORT: port,
	MONGODB_URL: process.env.MONGODB_URL
};

