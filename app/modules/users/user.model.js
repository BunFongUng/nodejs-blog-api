import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import uniqueValidator from 'mongoose-unique-validator';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import Post from '../posts/post.model';

let UserSchema = new Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
	},
	userName: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		validate: {
			validator: (value) => validator.isEmail(value),
			message: '{VALUE} is not valid email.'
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 6,
	},
	favorites: {
		posts: [{
			type: Schema.Types.ObjectId,
			ref: 'Post'
		}]
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
}, {
		timestamps: true
	});

UserSchema.plugin(uniqueValidator, {
	message: '{VALUE} already token.'
});

UserSchema.methods.toJSON = function () {
	let user = this;
	let userObject = user.toObject();
	return _.pick(userObject, ['_id', 'firstName', 'lastName', 'userName', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
	let user = this;
	let access = 'auth';

	let token = jwt.sign({

		_id: user._id.toHexString(),
		access,
	}, process.env.SECRET_KEY).toString();

	user.tokens.push({
		access,
		token
	});

	return user.save().then(() => token);
}

// UserSchema.methods = {
// 	_favorites: {
// 		async posts(postId) {
// 			if (this.favorites.posts.indexOf(postId) > -1) {
// 				this.favorites.posts.remove(postId);
// 				await Post.decFavoriteCount(postId);
// 			} else {
// 				this.favorites.posts.push(postId);
// 				await Post.incFavoriteCount(postId);
// 			}

// 			return this.save();
// 		},
// 		isPostIsFavorite(postId) {
// 			if(this.favorites.posts.indexOf(postId) > -1) {
// 				return true;
// 			}
// 			return false;
// 		}
// 	}
// };

UserSchema.statics.findByToken = function (token) {
	let User = this;
	let decoded;

	try {
		decoded = jwt.verify(token, process.env.SECRET_KEY);
	} catch (err) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'access'
	});
};

UserSchema.pre('save', function (next) {
	let user = this;

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});


export default mongoose.model('User', UserSchema);