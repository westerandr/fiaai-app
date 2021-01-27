const Game = require('../models/game');
module.exports = {

    /*NORMAL CRUD OPERATIONS*/ 

    // GET /games
    list: async function(_req,res){
        try{
            var games = await Game.find({});
            res.status(200).json({games: games});
        }catch(err) { 
            res.status(500).json({error: err});
        }  
    },

    // GET /games/:id
    show: async function(req,res){
        try{
            var id = req.params.id;
            var game = await Game.findById(id);
            res.status(200).json({game});
        }catch(err) { 
            res.status(500).json({error: err});
        }  
    },

    // POST /games/
    create: function(req,res){
        
    },

    // DELETE /games/:id
    delete: function(req,res){

    },

    /* GAME OPERATIONS */

    // PUT /games/:id/startGame
    startGame: function(req,res){

    },

    // PUT /games/:id/startGame
    endGame: function(req,res){

    },

    // PUT /games/:id/like/:placeId
    likePlace: function(req,res){

    },

    // PUT /games/:id/dislike/:placeId
    dislikePlace: function(req,res){

    },
    // GET /games/:id/status
    getStatus: function(req,res){

    },

    // GET /games/:id/winner
    getWinner: function(req,res){

    },

    // GET /games/:id/leastLiked
    getLeastLikedPlace: function(req,res){

    },

    // GET /games/:id/log
    getPlaceUserMap: function(req,res){

    },






}