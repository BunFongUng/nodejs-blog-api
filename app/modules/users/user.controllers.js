import User from './user.model';
import _ from 'lodash';

export function signUp(req, res) {
	let body = _.pick(req.body, ['firstName', 'lastName', 'userName', 'email', 'password']);
	let user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then(token => {
		res.header('x-auth', token).send(user);
	}).catch(err => {
		res.status(400).send(err);
	});
}