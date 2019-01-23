var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var ObjectId = mongoose.Schema.ObjectId;
const role = require('../config/role');

var userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	hash: { type: String, require: true },
	primPhone: { type: String, required: true, unique: true },
	role: { type: String, default: role.user }
});

userSchema.methods.encryptPassword = async function (password) {
	try {
		const hash = await bcrypt.genSalt(10);
		this.hash = hash;
		this.password = await bcrypt.hash(password, this.hash);

		return this.password;

	} catch (err) {
		return Promise.reject(err);
	}
};

userSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.createJwt = function () {
	let expiryTime = new Date();
	expiryTime.setDate(expiryTime.getDate() + 7);
	return jwt.sign({
		_id: this._id,
		role: this.role,
		email: this.email,
		primPhone: this.primPhone,
		firstName: this.firstName,
		lastName: this.lastName,
		expiryTime: parseInt(expiryTime.getTime() / 1000)
	}, process.env.JWT_KEY);
}

module.exports = mongoose.model('User', userSchema);