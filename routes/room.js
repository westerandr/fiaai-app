const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room');

router.get('/', roomController.list);
router.get('/:code', roomController.show);
router.post('/', roomController.create);
router.post('/:code/join', roomController.joinRoom);
router.post('/:code/leave', roomController.leaveRoom);
router.post('/:code/startGame', roomController.startGame);

module.exports = router;