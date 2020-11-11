const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const User = require("../models/User");
const Mixtape = require("../models/Mixtape");

// load controllers
// const { getUserById } = require("../controllers/users");

// load input validation
const { validateMixtapeInput, validateTrackInput } = require("../utils/mixtapes");


module.exports.createMixtape = async function (req, res) {
    const { errors, isValid } = validateMixtapeInput(req.body);    // Mixtape validation
    if (!isValid) return res.status(httpStatus.BAD_REQUEST).json(errors)

    // Creat mixtape and add branch obj inside
    const newMixtape = new Mixtape({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        tracks: [],
        user_branches: [],
        mixtape_cover: "",
        description: req.body.description,
        num_of_songs: 0,
        total_duration: 0,
        is_public: req.body.is_public,
        created_by: {
            user_id: req.body.user._id,
            name: req.body.user.username
        },
        share_link: "",
        num_of_likes: 0,
    });

    let retval = await newMixtape.save();
    if (retval == null){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `Mixtape could not be saved.`});
    }

    let updatedUser = await User.updateOne({"_id": req.body.user._id}, {
        $push: {mixtapes: { id: newMixtape._id, name: newMixtape.name }}
    });
    if (updatedUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no user found.`});
    }

    return res.json(newMixtape);
}

module.exports.deleteMixtape = async function (req, res) {
    let mixtape = await Mixtape.findOneAndDelete({ "_id": req.params.id });
    if (mixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ email: `Mixtape with id ${req.param.id} does not exist`});
    }
    let user = await User.update({ _id: req.body.user_id }, { $pull: { "mixtapes": { "_id": req.params.id } }});
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ email: `User with id ${req.body.user_id} does not exist`});
    }

    return res.json({ mixtape: mixtape });
}

module.exports.getMixtapeById = async function (id) {
    let mixtape = await Mixtape.findOne({"_id": id}).catch( (err) => {return null} );
    return mixtape;
}

async function getMixtapeHelper(id) {
    let mixtape = await Mixtape.findOne({"_id": id}).catch( (err) => {return null} );
    return mixtape;
}

module.exports.getMixtape = async function (req, res) {
    let mixtape = await getMixtapeHelper(req.params.id);

    if (mixtape != null) {
        return res.json({mixtape: mixtape});
    } else {
        return res.status(httpStatus.NOT_FOUND).json({ error: `Could not save mixtape.`});
    }
}

module.exports.addTrack = async function (req, res) {
    // const { errors, isValid } = validateTrackInput(req.body.track);    // Mixtape validation
    // if (!isValid) return res.status(400).json(errors)

    // Get mixtape
    var mixtape = await getMixtapeHelper(req.params.id);
    if (mixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Mixtapes found.`});
    }

    // Updating mixtape data
    let newTotalSongs = mixtape.num_of_songs + 1;
    let newDuration = (parseInt(mixtape.total_duration) + parseInt(req.body.track.duration));

    // Update tracks in mixtape
    let update_query = {
        "$set": {
            "total_duration": newDuration,
            "num_of_songs": newTotalSongs
        },
        "$push": {
            "tracks": req.body.track
        }
    };

    let newMixtape = await Mixtape.findOneAndUpdate({"_id": req.params.id}, update_query, {new: true});
    if (newMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Mixtapes found.`});
    }

    return res.json({ success: true, Mixtape: newMixtape });
}

module.exports.removeTrack = async function (req, res) {
    // const { errors, isValid } = validateTrackInput(req.body.track);    // Mixtape validation
    // if (!isValid) return res.status(400).json(errors)

    // Get mixtape
    var mixtape = await getMixtapeHelper(req.params.id);
    if (mixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Mixtapes found.`});
    }
    if (mixtape.num_of_songs === 0) {
        return res.status(httpStatus.BAD_REQUEST).json({ error: `There are no tracks to remove.`});
    }

    // Updating mixtape data
    let newTotalSongs = mixtape.num_of_songs - 1;
    let newDuration = (parseInt(mixtape.total_duration) - parseInt(req.body.track.duration));

    // Find track to remove in mixtape
    let tracks = mixtape.tracks;
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i]._id === req.body.track._id) {
            tracks.splice(i, 1);
            break;
        }
    }

    // Update tracks in mixtape
    let update_query = {
        "$set": {
            "total_duration": newDuration,
            "num_of_songs": newTotalSongs,
            "tracks": tracks
        }
    };
    let newMixtape = await Mixtape.findOneAndUpdate({"_id": req.params.id}, update_query, {new: true});
    if (newMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Mixtapes found.`});
    }

    return res.json({ success: true, Mixtape: newMixtape });
}
