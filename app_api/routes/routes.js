var express = require('express');
var router = express.Router();

// require('./rUser')(router);
require('./rAuth')(router);
require('./rProduct')(router);
require('./rHome')(router);

module.exports = router;