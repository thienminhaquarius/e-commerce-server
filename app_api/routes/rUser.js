
var user = require('../controllers/user');

module.exports = function (router) {
    router.get('/user/:userEmail/giohang', user.gioHangByUserEmail);
    router.post('/user/:userEmail/giohang', user.addGioHangByUserEmail);
}