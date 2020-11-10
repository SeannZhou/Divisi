const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const User = require("../models/User");
const Mixtape = require("../models/Mixtape");

// load controllers
const { getUserById } = require("../controllers/users");

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

    let user = await getUserById(req.body.user._id);
    let userMixtapes = user.mixtapes;
    userMixtapes.push(newMixtape);

    let updatedUser = await User.updateOne({"_id": req.body.user._id}, {
        $push: {mixtapes:  userMixtapes}
    });
    if (updatedUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no user found.`});
    }

    let retval = await newMixtape.save();
    if (retval){
        return res.json(newMixtape);
    } else {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no mixtapes found.`});
    }
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

    let user = await getUserById(req.body.user_id);
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `User with id ${req.body.user_id} does not exist`});
    }

    // Get mixtape
    var mixtape = await getMixtapeHelper(req.params.id);
    if (mixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Mixtapes found.`});
    }
    let newTotalSongs = mixtape.num_of_songs + 1;
    let newDuration = (parseInt(mixtape.total_duration) + parseInt(req.body.track.duration));

    // Update tracks in mixtape
    let update = {
        "$set": {
            "total_duration": newDuration,
            "num_of_songs": newTotalSongs
        },
        "$push": {
            "tracks": req.body.track
        }
    };

    let newMixtape = await Mixtape.findOneAndUpdate({"_id": req.params.id}, update, {new: true});
    if (newMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Mixtapes found.`});
    }

    let userMixtapes = user.mixtapes;
    for (let i = 0; i < userMixtapes.length; i++) {
        if (userMixtapes[i]._id === mixtape._id) {
            userMixtapes[i].total_duration = newDuration;
            userMixtapes[i].num_of_songs = newTotalSongs;
            userMixtapes[i].tracks.push(req.body.track);
            break;
        }
    }

    let newUser = await User.updateOne({"_id": req.body.user_id}, {mixtapes: userMixtapes});
    if (newUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `User with id ${req.body.user_id} does not exist`});
    }

    return res.json({ success: true, Mixtape: newMixtape });
}

module.exports.removeTrack = async function (req, res) {
    // const { errors, isValid } = validateTrackInput(req.body.track);    // Mixtape validation
    // if (!isValid) return res.status(400).json(errors)

    let user = await getUserById(req.body.user_id);
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `User with id ${req.body.user_id} does not exist`});
    }

    // Get mixtape
    var mixtape = await getMixtapeHelper(req.params.id);
    if (mixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Mixtapes found.`});
    }

    if (mixtape.num_of_songs === 0) {
        return res.status(httpStatus.BAD_REQUEST).json({ error: `There are no tracks to remove.`});
    }

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
    let update = {
        "$set": {
            "total_duration": newDuration,
            "num_of_songs": newTotalSongs,
            "tracks": tracks
        }
    };
    let newMixtape = await Mixtape.findOneAndUpdate({"_id": req.params.id}, update, {new: true});
    if (newMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Mixtapes found.`});
    }

    let userMixtapes = user.mixtapes;
    for (let i = 0; i < userMixtapes.length; i++) {
        if (userMixtapes[i]._id === mixtape._id) {
            userMixtapes[i].total_duration = newDuration;
            userMixtapes[i].num_of_songs = newTotalSongs;
            userMixtapes[i].tracks = tracks;
            break;
        }
    }

    let newUser = await User.updateOne({"_id": req.body.user_id}, {mixtapes: userMixtapes});
    if (newUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `User with id ${req.body.user_id} does not exist`});
    }

    return res.json({ success: true, Mixtape: newMixtape });
}
