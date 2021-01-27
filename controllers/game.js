const Game = require('../models/game');
const constants = require('../config/constants/GAME_CONSTANTS');
/**
 *         try{

        }catch(err){
            res.json({error: err});
        }
 */
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

    // DELETE /games/:id
    delete: async function(req,res){
        try{
            const id = req.params.id;
            await Game.findByIdAndDelete(id);
            res.json({msg:'Game Deletion OK', _id: id});
        }catch(err){
            res.json({error: err});
        }
    },

    /* GAME OPERATIONS */

    // PUT /games/:id/endGame
    endGame: async function(req,res){ 
        try{
            const id = req.params.id;
            var game = await Game.findById(id);
            game.gameStatus = constants.STATUS.EXPIRED;
            
        }catch(err){
            res.json({error: err});
        }
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
