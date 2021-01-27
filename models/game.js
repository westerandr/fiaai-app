const mongoose = require('mongoose');
const STATUS = require('../config/constants/GAME_CONSTANTS').STATUS;
const gameSchema = new mongoose.Schema({
    placesVotingMap: [{ place:{
        type: mongoose.Schema.ObjectId,
        ref: 'Place'
    },
    votes: {type: Number, default: 0}

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
    ],
    userVotes: [
        {
            user: {type: mongoose.Schema.ObjectId, ref:'User'},
            castedVotes: {type: Number, default: 0}
        }
    ]
});

module.exports = mongoose.model('Game', gameSchema);