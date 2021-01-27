const Room = require('../models/room');
const constants = require('../config/constants/ROOM_CONSTANTS');
/**
 *         try{

        }catch(err){
            res.json({error: err});
        }
 */
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
                    return new Date(a.joined_at) - new Date(b.joined_at);
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
    startGame: async function(){
        
    }
}