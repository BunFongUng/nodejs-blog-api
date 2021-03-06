import Joi from 'joi';

export const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
// regex(passwordReg).
export default {
	singUp: {
		body: {
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			userName: Joi.string().required()
		}
	}
};