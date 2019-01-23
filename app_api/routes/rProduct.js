
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'maJsonWebToken'
});

var product = require('../controllers/product');
var reviews = require('../controllers/reviews');

module.exports = function (router) {
    router.get('/xemthem-thoigian', product.xemThemByThoiGian);
    router.get('/sanpham-theoloai', product.sanPhamByLoai);
    router.get('/productDetails/:productID', product.productDetails);

    router.post('/sanpham/:idSanPham/like', product.like);
    router.post('/createProduct', product.createProduct);//
    router.post('/sanpham/:idSanPham/review', auth, reviews.reviewCreateOne);
    router.post('/giohang', product.xemGioHang);

}