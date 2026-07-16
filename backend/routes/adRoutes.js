const express = require('express');
const adController = require('../controllers/adController');

const router = express.Router();
router.get('/home', adController.getHomeAds);
module.exports = router;
