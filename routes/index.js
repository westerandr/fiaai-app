const express = require('express');
const router = express.Router();

const data = require('../dummy_data');
const games = [data.createGame('SPIES','g1' )];
const rooms = [data.createRoom('SPIES', 'g1')];
//Front Page
router.get('/', function(req, res){
    var dict = {
        title: 'Fiaai'
    }
    if(req.query.errorMsg){
        dict['errorMsg'] = true
    }else{
        dict['errorMsg'] = false
    }
    res.render('index');
});

router.get('/fiaai/client', function(req,res){
    res.render('fiaai', {title: 'Fiaai', name: req.query.name,room:req.query.room, places: data.places.sort(() => Math.random() - 0.5)});
});

router.post('/submitName', function(req,res){
    const name = req.body.name;
    const room = req.body.room;
    if(rooms.find(roomItem => roomItem.name == room)){
        return res.redirect('/fiaai/client?name='+name+'&room='+room);
    }
    res.redirect('/?errorMsg=RoomDoesNotExist');
});

module.exports = router;