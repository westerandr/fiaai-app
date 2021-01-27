const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    phone:Number,
    location: String,
    directions: String,
    category: String,
    description: String,
    tags: [String]
});

module.exports = mongoose.model('Place', placeSchema);