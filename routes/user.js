const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/',async function(_req,res){
    try{
        const users = await User.find({});
        res.status(200).json({users});
    }catch(err){
        res.json({error: err});
    }
});

router.get('/:id',async function(req,res){
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).json({user});
    }catch(err){
        res.json({error: err});
    }
});

router.post('/', async function(req,res){
    try{
        const user = await User.register(new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
        }), req.body.password);
        res.json({msg: 'User created via create method', _id: user._id});
        
    }catch(err){
        res.json({error:err});
    }
});

router.put('/:id',async function(req,res){
    try{
        const id = req.params.id;
        const wantsToChangePassword = req.body.password ? true : false;
        const user = await User.findByIdAndUpdate(id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
        });
        if(wantsToChangePassword){
            await user.setPassword(req.body.password);
        }
        await user.save();
        res.status(200).json({msg:'User Update OK', _id: user._id});
    }catch(err){
        res.json({error: err});
    }
});

router.delete('/:id',async function(req,res){
    try{
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        res.status(200).json({msg:'User Deletion OK', _id:id});
    }catch(err){
        res.json({error: err});
    }
});

module.exports = router;