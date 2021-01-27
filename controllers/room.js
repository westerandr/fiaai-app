const Room = require('../models/room');
const Game = require('../models/game');
const Place = require('../models/place');
const constants = require('../config/constants/ROOM_CONSTANTS');
const gameConstants = require('../config/constants/GAME_CONSTANTS');

module.exports = {
    // /GET /rooms
    list: async function(_req,res){
        try{
            const rooms = await Room.find({});
            res.json({rooms}); 
        }catch(err){
            res.json({error: err});
        }
    },

    // GET /rooms/:code
    show: async function(req,res){
        try{
            const code = req.params.code;
            const room = await Room.findOne({code: code});
            res.json({room});
        }catch(err){
            res.json({error: err});
        }
    },

    //POST /rooms
    create: async function(req, res){
        try{
            const createdRoom = await new Room({
                leader: req.user,
                users: [req.user],
            }).save();

            res.json({msg:'Room Created', leader: req.user, code: createdRoom.code});
        }catch(err){
            res.json({error: err});
        }
    },

    //POST /rooms/:code/join
    joinRoom: async function(req, res){
        try{
            const retrievedRoom = await Room.findOne({code:req.params.code});
            if(retrievedRoom.users.includes(req.user._id)){
                throw new Error(`User Id ${req.user._id} already in Room: ${req.params.code}`);
            }
            const ableToJoin = retrievedRoom.party < constants.PARTY_LIMIT;
            const hasGame = retrievedRoom.currentGame? true:false;
            if(ableToJoin && !hasGame){
                retrievedRoom.users.push(req.user);
                retrievedRoom.party += 1;
                const updatedRoom = await retrievedRoom.save();
                return res.json({msg:`User Id ${req.user._id} joined Room ${req.params.code}, PARTY SIZE NOW AT: ${updatedRoom.party}`});   
            }else{
                if(hasGame){
                    throw new Error(`Room ${req.params.code} has already started a game, please try again later.`);
                }else{
                    throw new Error(`Room ${req.params.code} has reached party limit, please wait for space to be available.`);
                }
            } 
        }catch(err){
            res.json({error: err});
        }
    },

    //POST /rooms/:code/leave
    leaveRoom: async function(req,res){
        try{
            const retrievedRoom = await Room.findOne({code:req.params.code});
            if(!retrievedRoom.users.includes(req.user._id)){
                throw new Error(`You cannot perform this action`);
            }
            if(retrievedRoom.users.length == 1 && retrievedRoom.party == 1){
                await Room.findByIdAndDelete(retrievedRoom._id);
                return res.json({msg:'Room Deleted, Last Party Member Left', code: req.params.code });
            }
            if(req.user._id == retrievedRoom.leader){
                //get next person who joined
                const sortedUsersByDate = retrievedRoom.users.sort(function(a,b){
                    return new Date(a.joinedAt) - new Date(b.joinedAt);
                }).slice();
                const nextLeader = sortedUsersByDate[1];
                retrievedRoom.leader = nextLeader;
            }
            retrievedRoom.users.pull({_id: req.user._id});
            retrievedRoom.party -= 1;
            const updatedRoom = await retrievedRoom.save();
            return res.json({msg:`User Id ${req.user._id} left Room ${req.params.code}, PARTY SIZE NOW AT: ${updatedRoom.party}`});   

        }catch(err){
            res.json({error: err});
        }
    },

    //POST /rooms/:code/startGame
    startGame: async function(req,res){
        try{
            const roomCode = req.params.code;
            const retrievedRoom = await Room.findOne({code: roomCode});
            //check room exists
            if(!retrievedRoom){
                throw new Error(`Room Code ${roomCode} does not exist`);
            }
            //check if user is room leader
            if(retrievedRoom.leader != req.user._id){
                throw new Error(`You are not the Room Leader`);
            }
            //check if number of users optimal for Game start
            if(retrievedRoom.users.length < constants.PARTY_OPTIMAL_NUMBER_TO_START && retrievedRoom.party < constants.PARTY_OPTIMAL_NUMBER_TO_START){
                return res.json({msg: `Unable to start Game, Need at least ${constants.PARTY_OPTIMAL_NUMBER_TO_START} to start`});
            }
            //checkk if all users ready
            const allReady = allUsersReady(retrievedRoom.users);
            if(!allReady){
                return res.json({msg: `Unable to start Game, All ${retrievedRoom.party} Users must be ready` });
            }

            //start game here
            const placesVotingMap = await getPlacesVotingMap();
            const game = new Game({
                placesVotingMap: placesVotingMap,
                gameStatus: gameConstants.STATUS.RUNNING
            });
            await game.save();
            res.json({msg:'Game Created', _id:game._id, room:retrievedRoom.code, numUsers: retrievedRoom.party});
        }catch(err){
            res.json({error: err});
        }
    }
}
/**
 * Checks if All Users are Ready
 * @param {*} users 
 */

function allUsersReady(users){
    let allUsersReady = true;
    for(var i = 0; i < users.length; i++){
        var userIsReady = users[i].readyToStart;
        if(!userIsReady){
            allUsersReady = false;
        }
    }
    return allUsersReady;
}

/**
 * Get a List of Place to Votes Objects
 */
async function getPlacesVotingMap(){
    const places = await Place.find({});
    var list = [];
    for(var i = 0; i < places.length; i++){
        var place = places[i];
        list.push({place: place, votes: 0});
    }
    return list;
}