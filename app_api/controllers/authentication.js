var passport = require('passport');
var User = require('../models/USER');
var emailValid = require("email-validator");

var sendJSONRespone = function (res, status, content) {
	res.status(status);
	res.json(content);
};


exports.register = async (req, res) => {
	if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.primPhone) {
		return sendJSONRespone(res, 400, { "message": "All fields required" });
	}
	if (!emailValid.validate(req.body.email))
		return sendJSONRespone(res, 400, { "message": "Email not valid!" });
	if (!(/^\d{10}$/.test(req.body.primPhone))) {
		return sendJSONRespone(res, 400, { "message": "Phone not valid!" });
	}

	let user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email.toLowerCase(),
		primPhone: req.body.primPhone,
	});
	try {
		let result = await user.encryptPassword(req.body.password)
		delete result;
		user = await user.save();
		token = user.createJwt();
		return sendJSONRespone(res, 200, { "token": token });

	} catch (err) {
		return sendJSONRespone(res, 400, err);
	}
};

exports.login = function (req, res) {
	if (!req.body.primPhone || !req.body.password) {
		sendJSONRespone(res, 400, { "message": "All fields required" });
		return;
	}
	passport.authenticate('local-login', function (err, user, info) {
		var token;
		if (err) {
			sendJSONRespone(res, 404, err);
			return;
		}
		if (user) {
			token = user.createJwt();
			sendJSONRespone(res, 200, { "token": token,
			"msg":"Login success"
		 });
		} else {
			sendJSONRespone(res, 404, info);
		}
	})(req, res);
};