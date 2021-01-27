const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.post('/register', async function(req,res){
    try{
        const user = await User.register(new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
        }), req.body.password);
        res.json({msg: 'User created', _id: user._id});
        
    }catch(err){
        res.json({error:err});
    }
});

router.post('/login', passport.authenticate('local'), function(_req,res){
    res.redirect('/');
});

router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});


module.exports = router;