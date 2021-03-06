const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');

router.get('/', gameController.list);

module.exports = router;