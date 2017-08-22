import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import slug from 'slug';
import _ from 'lodash';

const PostSchema = new Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Title is required.'],
		minlength: 3,
		unique: true
	},
	text: {
		type: String,
		required: [true, 'Text is required.'],
		minlength: 10
	},
	slug: {
		type: String,
		trim: true,
		lowercase: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	favoriteCount: {
		type: Number,
		default: 0
	}
}, {
	timestamps: true
});

PostSchema.plugin(uniqueValidator, {
	message: '{VALUE} is already token.'
});

PostSchema.pre('validate', function(next) {
	this._slugtify();
	next();
});

PostSchema.methods._slugtify = function() {
	this.slug = slug(this.title);
};

PostSchema.methods.toJSON = function() {
	let post = this;
	let postObject = post.toObject();

	return _.pick(postObject, ['_id', 'title', 'text', 'slug', 'user', 'favoriteCount', 'createdAt']);
};

PostSchema.statics.createPost = function(args, user) {
	let _args = Object.assign({}, args);
	return this.create({
		_args,
		user
	});
};

PostSchema.statics.list = function({ skip = 0, limit = 5 } = {}) {
	return this.find()
							.sort({ createdAt: -1 })
							.skip(skip)
							.limit(limit)
							.populate('user');
};

PostSchema.statics.incFavoriteCount = function(postId) {
	return this.findByIdAndUpdate(postId, {
		$inc: {
			favoriteCount: 1
		}
	});
};

PostSchema.statics.decFavoriteCount = function(postId) {
	return this.findByIdAndUpdate(postId, {
		$inc: {
			favoriteCount: -1
		}
	});
};

export default mongoose.model('Post', PostSchema);