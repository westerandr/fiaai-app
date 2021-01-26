const express = require('express');
const router = express.Router();

//Front Page
router.get('/', function(req, res, next){
    res.render('index', {title: 'Fiaai'});
});

router.get('/fiaai/client', function(req,res,next){
    res.render('fiaai', {title: 'Fiaai', name: req.query.name});
});

router.post('/submitName', function(req,res,next){
    const name = req.body.name;
    res.redirect('/fiaai/client?name='+name);
});

module.exports = router;