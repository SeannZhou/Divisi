const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const User = require("../models/User");
const Mixtape = require("../models/Mixtape");
const Group = require("../models/Group");
const Track = require("../models/Track");
const { TOO_MANY_REQUESTS } = require('http-status');

module.exports.createMixtape = async function (req, res) {
    // Creat mixtape and add branch obj inside
    const newMixtape = new Mixtape({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        tracks: [],
        user_branches: [],
        mixtape_cover: req.body.mixtape_cover,
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
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `mixtape could not be saved.`});
    }
    let updatedUser = await User.findOneAndUpdate({"_id": req.body.user._id}, {
        $push: {mixtapes: { _id: newMixtape._id, name: newMixtape.name }}
    }, {new: true} );
    if (updatedUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.body.user._id} does not exist`});
    }

    return res.status(httpStatus.CREATED).json({ mixtape: newMixtape, user: updatedUser });
}

module.exports.deleteMixtape = async function (req, res) {
    // Delete mixtape
    let mixtape = await Mixtape.findOneAndDelete({ "_id": req.params.mixtape_id });
    if (mixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${req.params.mixtape_id} does not exist`});
    }
    // Remove mixtape in user obj
    let user = await User.findOneAndUpdate({ _id: req.params.user_id }, { $pull: { "mixtapes": { "_id": req.params.mixtape_id }}}, {new: true});
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.params.user_id} does not exist`});
    }
    // Remove mixtape from user groups
    let updatedGroup = await Group.update(
        { _id: { $in: user.groups } },
        { $pull: { mixtapes: { _id: req.params.mixtape_id } } },
        { multi: true }
    );
    if (updatedGroup == null) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `Updating groups failed.`});
    }

    return res.status(httpStatus.OK).json({ mixtape: mixtape, user: user });
}

async function getMixtapeHelper(id) {
    let mixtape = await Mixtape.findOne({"_id": id}).catch( (err) => {return null} );
    return mixtape;
}

module.exports.getMixtapeById = getMixtapeHelper();

module.exports.getMixtape = async function (req, res) {
    let mixtape = await getMixtapeHelper(req.params.id);

    if (mixtape != null) {
        return res.status(httpStatus.OK).json({ mixtape: mixtape });
    } else {
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${req.params.id} does not exist`});
    }
}

module.exports.addTrack = async function (req, res) {
    // Get mixtape
    let mixtape = await getMixtapeHelper(req.params.id);
    if (mixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${req.params.id} does not exist`});
    }
    //check if track exists, if not create a new one
    let newTrack = await Track.findOne({"title": req.body.track.name});
    if(newTrack == null){
        trackBody = req.body.track;
        trackBody._id = mongoose.Types.ObjectId();
        newTrack = new Track(trackBody);
        await newTrack.save();
    }
    // Updating mixtape data
    let newTotalSongs = mixtape.num_of_songs + 1;
    // let newDuration = (parseInt(mixtape.total_duration) + parseInt(newTrack.duration));

    // Update tracks in mixtape
    let update_query = {
        "$set": {
            // "total_duration": newDuration,
            "num_of_songs": newTotalSongs
        },
        "$push": {
            "tracks": newTrack
        }
    };

    let newMixtape = await Mixtape.findOneAndUpdate({"_id": req.params.id}, update_query, {new: true});
    if (newMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${req.params.id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ mixtape: newMixtape });
}

module.exports.removeTrack = async function (req, res) {
    // Get mixtape
    var mixtape = await getMixtapeHelper(req.params.id);
    if (mixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${req.params.id} does not exist`});
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
        if (tracks[i]._id.equals(req.body.track._id)) {
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
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${req.params.id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ mixtape: newMixtape });
}

module.exports.updateMixtape = async function (req, res) {
    let updatedMixtape = await Mixtape.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
    if (updatedMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${req.params.id} does not exist`});
    }
    let updatedUser = null;
    // Check if need to update name in user obj
    if (req.body.name) {
        updatedUser = await User.findOneAndUpdate({ _id: updatedMixtape.created_by.user_id, "mixtapes._id": req.params.id },
        { "$set": {
            "mixtapes.$.name": req.body.name
        } }, {new: true} );
    } else {
        updatedUser = await User.findOne({ _id: updatedMixtape.created_by.user_id });
    }

    if (updatedUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${updatedMixtape.created_by.user_id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ mixtape: updatedMixtape, user: updatedUser });
}

