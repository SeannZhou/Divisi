const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require('http-status');

// load models
const Track = require("../models/Track");
const Artist = require("../models/Artist");

module.exports.getTrack = function (req, res) {
    console.log(req.params.id);
    Track.findById(req.params.id).then(track => {
        if (track){
            return res.json({track: track});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `there are no tracks found with id ${req.params.id}`});
        }
    })
}

module.exports.getArtist = function (req, res) {
    console.log(req.params.id);
    console.log("getArtist");

    // 5fb4816a255b820f26f759fc
    // let newArtist = new Artist({
    //     _id: mongoose.Types.ObjectId(),
    //     name: "new artist"
    // });
    //
    // let retval = await newArtist.save();
    // if (retval == null){
    //     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `artist could not be saved.`});
    // }

    Artist.findById(req.params.id).then(artist => {
        if (artist){
            return res.json({artist: artist});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `there are no artist found with id ${req.params.id}`});
        }
    })
}
