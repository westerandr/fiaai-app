const mongoose = require('mongoose');
const randomWords = require('random-words');
const constants = require('../config/constants/ROOM_CONSTANTS');

const roomSchema = new mongoose.Schema({
    code : { type: String, unique: true, default: randomWords(1,{min:5, max:5}) },
    party: { type: Number, default: 1, max:constants.PARTY_LIMIT},
    createdAt: { type: Date, expires: constants.ROOM_SESSION_EXPIRATION },
    leader:{ type: mongoose.Schema.ObjectId, ref: 'User'},
    users: [
        {
            user: {type: mongoose.Schema.ObjectId, ref: 'User'},
            socketId: String,
            joinedAt: Date,
            readyToStart: Boolean,
        }
    ],
    currentGame: {
        type: mongoose.Schema.ObjectId,
        ref: 'Game'
    }
});


module.exports = mongoose.model('Room', roomSchema);