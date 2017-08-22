import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import uniqueValidator from 'mongoose-unique-validator';
import { passwordReg } from './user.validation';
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
			validator : (value) => validator.isEmail(value),
			message: '{VALUE} is not valid email.'
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 6,
		validate: {
			validator: (password) => passwordReg.test(password),
			message: '{VALUE} is not valid password.'
		}
	},
	favorites: {
		posts: [{
			type: Schema.Types.ObjectId,
			ref: 'Post'
		}]
	}
}, {
	timestamps: true
});

UserSchema.plugin(uniqueValidator, {
	message: '{VALUE} already token.'
});

UserSchema.pre('save', function() {

});

export default mongoose.model('User', UserSchema);