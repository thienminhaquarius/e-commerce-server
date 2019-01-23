
var authCtr = require('../controllers/authentication');

module.exports = function (router) {
    router.post('/register', authCtr.register);
    router.post('/login', authCtr.login);
}