var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	useID: { type: String, require: true },

	userName: { type: String, required: true },

	content: { type: String, required: true },

	timestamp: { type: Date, default: Date.now },

	rating: { type: Number, default: 3, min: 0, max: 5 },

	likes: { type: Number, default: 0 }

});

var productSchema = new mongoose.Schema({
	productID: { type: String, unique: true, required: true },

	name: { type: String, required: true },

	img: { type: String, required: true },

	number: { type: Number, required: true, min: 0 },

	rating: { type: Number, default: 0, min: 0, max: 5 },

	price: { type: Number, required: true, min: 0 },

	type: { type: String, required: true },

	description: { type: String },

	moreDescription: { type: String },

	timestamp: { type: Date, default: Date.now },

	likes: { type: Number, default: 0 },

	views: { type: Number, default: 0 },

	reviews: [commentSchema]
});

module.exports = mongoose.model('Product', productSchema);