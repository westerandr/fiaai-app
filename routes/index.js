const express = require('express');
const router = express.Router();

const Place = require('../models/place');

//Front Page
router.get('/', function(req, res){
    if(req.query){
        req.flash('error', req.query.errorMsg);
    }
    res.render('index');
});

router.get('/fiaai/client', async function(req,res){
    const places = await Place.find({});
    const name = req.query.name;
    if(!name){
        req.flash('error', 'Please enter a name');
        return res.redirect('/');
    }
    req.session.name = name;
    res.render('fiaai', {name: name, places:places});
});

//API Routes
const gameRoutes = require('./game');
const placeRoutes = require('./place');
const userRoutes = require('./user');
const authRoutes = require('./auth');
router.use('/api/game/', gameRoutes);
router.use('/api/places/', placeRoutes);
router.use('/api/users/', userRoutes);
router.use('/auth/', authRoutes);

module.exports = router;