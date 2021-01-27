const mongoose = require('mongoose');
const STATUS = require('../config/constants/GAME_CONSTANTS').STATUS;
const gameSchema = new mongoose.Schema({
    places: [{ place:{
        type: mongoose.Schema.ObjectId,
        ref: 'Place'
    },
    votes: Number

}],
    gameStatus: {
        type: Number,
        enum: [STATUS.NOT_READY,STATUS.RUNNING,STATUS.EXPIRED],
        default: STATUS.NOT_READY
    },
    mostVotes: [String],
    placesWithNoVotes: [String],
    placesToUsersMap: [
        {
            place: {type: mongoose.Schema.ObjectId, ref: 'Place'},
            user: {type: mongoose.Schema.ObjectId, ref:'User'}
        }
    ]
});

module.exports = mongoose.model('Game', gameSchema);