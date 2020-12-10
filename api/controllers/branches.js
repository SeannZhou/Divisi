const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const Branch = require("../models/Branch");
const Mixtape = require("../models/Mixtape");


module.exports.createBranch = async function (req, res) {
    // Create group and add branch obj inside
    const newBranch = new Branch({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        created_by: {
            user_id: req.body.created_by.user_id,
            name: req.body.created_by.name
        },
        branched_from: {
            mixtape_id: req.body.branched_from.mixtape_id,
            name: req.body.branched_from.name
        },
        share_link: "",
        tracks: req.body.tracks
    });

    // Save new branch
    let retval = await newBranch.save();
    if (retval == null) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `Branch could not be saved.` });
    }

    // Add new branch to base mixtape
    let updatedMixtape = await Mixtape.updateOne({ _id: req.body.branched_from.mixtape_id }, {
        $push: {
            user_branches:
            {
                branch_id: newBranch._id,
                branch_name: newBranch.name,
                created_by: {
                    user_id: newBranch.created_by.user_id,
                    name: newBranch.created_by.name
                }
            }
        }
    });
    if (updatedMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${req.body.mixtape_id} does not exist` });
    }

    // Add new branch to user
    let updatedUser = await User.findOneAndUpdate({ _id: req.body.created_by.user_id }, {
        $push: { branches: { _id: newBranch._id, name: newBranch.name } }
    }, { new: true });
    if (updatedUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.body.created_by.user_id} does not exist` });
    }

    return res.status(httpStatus.OK).json({ branch: newBranch, user: updatedUser });
}

async function getBranchHelper(id) {
    let branch = await Branch.findOne({ "_id": id }).catch((err) => { return null });
    return branch;
}

module.exports.getBranch = async function (req, res) {
    let branch = await getBranchHelper(req.params.id);

    if (branch != null) {
        return res.status(httpStatus.OK).json({ branch: branch });
    } else {
        return res.status(httpStatus.NOT_FOUND).json({ error: `branch with id ${req.params.id} does not exist` });
    }
}

module.exports.addTrack = async function (req, res) {
    // Get branch
    let branch = await getBranchHelper(req.params.id);
    if (branch == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Branches found.` });
    }
    // check if track obj exists, if not create new one
    let newTrack = await Track.findOne({ "title": req.body.track.name });
    if (newTrack == null) {
        trackBody = req.body.track;
        trackBody._id = mongoose.Types.ObjectId();
        newTrack = new Track(trackBody);
        await newTrack.save();
    }

    let newBranch = await Branch.findOneAndUpdate({ "_id": req.params.id }, { $push: { "tracks": newTrack } }, { new: true });
    if (newBranch == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `branch with id ${req.params.id} does not exist` });
    }

    return res.status(httpStatus.OK).json({ branch: newBranch });
}

module.exports.removeTrack = async function (req, res) {
    let branch = await getBranchHelper(req.params.branch_id);
    if (branch == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `branch with id ${req.params.branch_id} does not exist` });
    }
    if (branch.tracks.filter(obj => (obj._id == req.params.track_id)).length == 0) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `track with id ${req.params.track_id} does not exist in branch` });
    }

    let tracks = branch.tracks;
    for (let i = 0; i < tracks.length; i++) {
        if (tracks[i]._id == req.params.track_id) {
            tracks.splice(i, 1);
            break;
        }
    }

    let newBranch = await Branch.findOneAndUpdate({ "_id": req.params.branch_id }, { "$set": { "tracks": tracks } }, { new: true });
    if (newBranch == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `branch with id ${req.params.branch_id} does not exist` });
    }

    return res.status(httpStatus.OK).json({ branch: newBranch });
}

module.exports.deleteBranch = async function (req, res) {
    let branch = await Branch.findOneAndDelete({ _id: req.params.id });
    if (branch == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `branch with id ${req.params.id} does not exist` });
    }

    let update_query = {
        $pull: {
            user_branches:
                { branch_id: req.params.id }
        }
    };
    let newMixtape = await Mixtape.findOneAndUpdate({ _id: branch.branched_from.mixtape_id }, update_query, { new: true });
    if (newMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${branch.branched_from.mixtape_id} does not exist` });
    }

    // Remove branch in user obj
    let user = await User.findOneAndUpdate({ _id: branch.created_by.user_id }, { $pull: { "branches": { "_id": req.params.id } } }, { new: true });
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${branch.created_by.user_id} does not exist` });
    }

    return res.status(httpStatus.OK).json({ branch: branch, user: user });
}

module.exports.updateBranch = async function (req, res) {
    let updatedBranch = await Branch.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
    if (updatedBranch == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `branch with id ${req.params.id} does not exist` });
    }

    let updatedUser = null;
    // Check if need to update name in user obj
    if (req.body.name) {
        updatedUser = await User.findOneAndUpdate({ _id: updatedBranch.created_by.user_id, "branches._id": req.params.id },
            {
                "$set": {
                    "branches.$.name": req.body.name
                }
            }, { new: true });
    } else {
        updatedUser = await User.findOne({ _id: updatedBranch.created_by.user_id });
    }

    if (updatedUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${updatedMixtape.created_by.user_id} does not exist` });
    }

    return res.status(httpStatus.OK).json({ branch: updatedBranch, user: updatedUser });
}
