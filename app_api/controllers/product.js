var mongoose = require('mongoose');
var Product = require('../models/PRODUCT');
var async = require('async');

var sendJsonRespone = function (res, status, content) {
	res.status(status);
	res.json(content);
};

exports.homepageProducts = async (req, res) => {
	let number = Number(req.query.number)
	if (!number || isNaN(number)) {
		sendJsonRespone(res, 404, { "msg": "Number params not found!" });
		return;
	}

	number = parseInt(number);

	let productNews, productCmts, productRatings;

	try {
		productNews = await Product.find().sort('-thoiGian').limit(number).select('name img price rating reviews');
		productCmts = await Product.find().sort('-reviews').limit(number).select('name img price rating reviews');
		productRatings = await Product.find().sort('-rating').limit(number).select('name img price rating reviews');

	} catch (err) {
		return sendJsonRespone(res, 400, error);
	}

	sendJsonRespone(res, 200, {
		productNews,
		productCmts,
		productRatings
	})
}

exports.createProduct = async (req, res) => {
	try {
		let product = await Product.create({
			productID: req.body.productID,
			name: req.body.name,
			img: req.body.img,
			number: req.body.number,
			price: req.body.price,
			type: req.body.type,
			description: req.body.description
		})
		sendJsonRespone(res, 201, product);
	} catch (err) {
		sendJsonRespone(res, 400, err);
	}
}

exports.productDetails = async (req, res) => {

	if (req.params && req.params.productID) {
		let product;
		try {
			product = await Product.findOne({ productID: req.params.productID }).select('-reviews');
			if (!product) {
				return sendJsonRespone(res, 404, { msg: `Product ID: ${req.params.productID} not found` })
			}
			product.views = product.views + 1;
			sendJsonRespone(res, 200, product);

		} catch (err) {
			console.log('findOne product error:  ', err)
			return sendJsonRespone(res, 400, { msg: 'findOne product id error' })
		}

		//update views
		try {
			product = await product.save();
		} catch (err) {
			console.log('product update view error:  ', err)
		}

	} else {
		sendJsonRespone(res, 404, { 'msg': 'No productID params in request' })
	}

};

exports.like = function (req, res) {

	if (req.params && req.params.productID) {
		Product.findById(req.params.productID).exec(function (err, sanpham) {
			if (err) {
				return sendJsonRespone(res, 400, err);//unsuccessfull request
			} else if (!sanpham) {
				return sendJsonRespone(res, 404, { 'msg': 'khong tim duoc san pham' })
			}
			sanpham.likes = sanpham.likes + 1;
			sanpham.save(function (err, sanpham) {
				if (err) {
					console.log(err);
					sendJsonRespone(res, 400, err);
					return;
				}
				sendJsonRespone(res, 200, sanpham.likes);
			});
		});
	} else {
		sendJsonRespone(res, 404, { 'msg': 'No productID in request' });
	}
};

exports.xemThemByThoiGian = function (req, res) {
	if (req.query.currentsoluong) {
		var currentsoluong = parseInt(req.query.currentsoluong);
		var number = currentsoluong + 12;
		Product.find().sort('-thoiGian').limit(number).select('tenSanPham tenFileAnh gia rating reviews')
			.exec(function (error, sanphams) {
				if (error) {
					return sendJsonRespone(res, 400, error)
				} else if (!sanphams) {
					return sendJsonRespone(res, 404, { "msg": "Khong tim duoc san pham nao" })
				}
				if (sanphams.length < number) {	// da tim het san pham de xem them;
					sanphams = sanphams.slice(currentsoluong, number);
					sendJsonRespone(res, 200, {
						sanphams: sanphams,
						buttonStatus: false
					});
				} else {
					sanphams = sanphams.slice(currentsoluong, number);
					sendJsonRespone(res, 200, {
						sanphams: sanphams,
						buttonStatus: true
					});
				}

			});
	} else {
		sendJsonRespone(res, 404, { 'msg': 'khong tim thay currentsoluong' });
	}
};
exports.sanPhamByLoai = function (req, res) {
	if (!req.query.currentsoluong) {
		return sendJsonRespone(res, 404, { 'msg': 'khong tim thay currentsoluong' });
	}
	if (!req.query.tenloaisanpham) {
		return sendJsonRespone(res, 404, { 'msg': 'khong tim thay tenloaisanpham' });
	}
	var currentsoluong = parseInt(req.query.currentsoluong);
	var number = currentsoluong + 12;
	Product.find({ 'loaiSanPham': req.query.tenloaisanpham }).sort('-thoiGian').limit(number).select('tenSanPham tenFileAnh gia rating reviews')
		.exec(function (error, sanphams) {
			if (error) {
				return sendJsonRespone(res, 400, error)
			} else if (!sanphams) {
				return sendJsonRespone(res, 404, { "msg": "Khong tim duoc san pham nao" })
			}
			if (sanphams.length < number) {	// da tim het san pham de xem them;
				sanphams = sanphams.slice(currentsoluong, number);
				sendJsonRespone(res, 200, {
					sanphams: sanphams,
					buttonStatus: false
				});
			} else {
				sanphams = sanphams.slice(currentsoluong, number);
				sendJsonRespone(res, 200, {
					sanphams: sanphams,
					buttonStatus: true
				});
			}

		});
};

exports.xemGioHang = function (req, res) {
	if (!req.body.arrayHang) {
		console.log('đenay');
		return sendJsonRespone(res, 400, { "msg": "Khong tim duoc arrayHang" })
	} else {
		//sendJsonRespone(res,200,req.body.arrayHang);
		var queryMotSanPham = function (productID, callback) {

			Product.findById(productID).select('-reviews').exec(function (err, sanpham) {
				if (err) {
					return callback(err, null);
				}
				if (!sanpham) {
					return callback({ "msg": "khong tim duoc san pham" }, null);
				} else {
					return callback(null, sanpham);
				}
			});
		};
		console.log('aray hang: ' + req.body.arrayHang);
		var arrayHang = JSON.parse(req.body.arrayHang);


		async.map(arrayHang, queryMotSanPham, function (err, results) {
			if (err) {
				return sendJsonRespone(res, 400, err);
			}
			sendJsonRespone(res, 201, results);
		});
	}
};