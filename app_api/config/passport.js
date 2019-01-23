//config passport

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/USER');

passport.use('local-login', new LocalStrategy(
	{ usernameField: 'primPhone' },
	function (username, password, done) {
		User.findOne({ primPhone: username }, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				console.log('not user')
				return done(null, false, { "msg": 'username or password is incorrect' });
			}

			if (!user.comparePassword(password)) {
				console.log('compare pass')

				return done(null, false, { "msg": 'username or password is incorrect' });
			}
			return done(null, user);
		});
	}));
