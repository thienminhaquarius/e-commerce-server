
var product = require('../controllers/product');

module.exports = function (router) {
    router.get('/home', product.homepageProducts);
}