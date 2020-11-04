const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require('http-status');

// load models
const Track = require("../models/Track");

module.exports.getTrack = function (req, res) {
    console.log(req.params.id);
    Track.findById(req.params.id).then(track => {
        if (track){
            return res.json({track: track});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `There are no tracks with that ID found.`});
        }
    })
}
