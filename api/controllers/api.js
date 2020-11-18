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
            return res.status(httpStatus.OK).json({track: track});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `there are no tracks found with id ${req.params.id}`});
        }
    })
}

module.exports.getArtist = function (req, res) {
    console.log(req.params.id);
    Artist.findById(req.params.id).then(artist => {
        if (artist){
            return res.status(httpStatus.OK).json({artist: artist});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `there are no artist found with id ${req.params.id}`});
        }
    })
}
