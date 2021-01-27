const Place = require('../models/place');

module.exports = {

    // GET /places/
    list: async function(_req,res){
        try{
            const places = await Place.find({});
            res.status(200).json({places});
        }catch(err){
            res.status(500).json({error: err.toString()});
        }
    },

    // GET /places/:id
    show: async function(req,res){
        try{
            var id = req.params.id;
            const place = await Place.findById(id);
            res.status(200).json({place});
        }catch(err){
            res.status(500).json({error: err.toString()});
        }
    },

    // POST /places/
    create: async function(req,res){
        try{
            const place = new Place(req.body);
            await place.save();
            res.status(200).json({_id: place._id});
        }catch(err){
            res.status(500).json({error: err.toString()});
        }
    },

    // PUT /places/:id
    update: async function(req,res){
        try{
            var id = req.params.id;
            const place = await Place.findByIdAndUpdate(id,req.body);
            res.status(200).json({msg: `Update OK`, _id: place._id});
        }catch(err){
            res.status(500).json({error: err.toString()});
        }
    },

    // DELETE /places/:id
    remove: async function(req,res){
        try{
            var id = req.params.id;
            await Place.findByIdAndDelete(id);
            res.status(200).json({msg: `Delete OK`, _id: id});
        }catch(err){
            res.status(500).json({error: err.toString()});
        }
    }


}