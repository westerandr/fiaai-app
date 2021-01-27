const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: {type:String, required:true, unique:true},
    image: {type:String, required:true, unique:true},
    phone:Number,
    location: String,
    directions: String,
    category: String,
    description: String
});

module.exports = mongoose.model('Place', placeSchema);