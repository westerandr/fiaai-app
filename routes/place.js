const express = require('express');
const router = express.Router();
const placeController = require('../controllers/place');

router.get('/', placeController.list);
router.get('/:id', placeController.show);
router.post('/', placeController.create);
router.put('/:id', placeController.update);
router.delete('/:id', placeController.remove);

module.exports = router;