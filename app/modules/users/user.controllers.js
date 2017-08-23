import User from './user.model';
import _ from 'lodash';

export async function signUp(req, res, next) {
	try {
		let body = _.pick(req.body, ['firstName', 'lastName', 'userName', 'email', 'password']);
		let user = new User(body);

		await user.save();
		let token = await user.generateAuthToken();

		res.header('x-auth', token).send(user);
	} catch (e) {
		res.status(400).send(e);
		next(e)
	}
}
