const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const Mixtape = require("../models/Mixtape");
const User = require("../models/User");


// load input validation
const validateMixtapeInput = require("../utils/mixtapes");
// const createBranch = require("../utils/mixtapes");

/*
create mixtape end point
* create mixtape obj
* create branch
    fill in default values

* */

module.exports.createMixtape = function (req, res) {
    const { errors, isValid } = validateMixtapeInput(req.body);    // Mixtape validation
    if (!isValid) return res.status(400).json(errors)

    // Creating new branch object
    let newBranchData = {
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        created_by: req.body.user._id,
        share_link: "",
        tracks: []
    }
    let newBranch = new Branch(newBranchData);
    newBranch.save()
        .then(newBranch => {
            console.log(newBranchData);
        })
        .catch(err => console.log(err));

    // Creat mixtape and add branch obj inside
    const newMixtape = new Mixtape({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        branch: newBranchData,
        user_branches: [],
        mixtape_cover: "",
        description: "",
        num_of_songs: 0,
        total_duration: 0,
        is_public: req.body.is_public,
        created_by: req.body.user._id,
        share_link: "",
        who_likes: [],
        num_of_likes: 0,
    });

    newMixtape.save().then(mixtape => {
        if (mixtape) {      // Save into user if new mixtape successful
            let userMixtapes = req.body.user.mixtapes;
            userMixtapes.push(mixtape);

            // Update User mixtapes
            User.updateOne({"_id": req.body.user._id}, {mixtapes: userMixtapes}).then(promise => {
                if (promise.n == 1) {
                    return res.json(mixtape);
                } else {
                    return res.status(httpStatus.NOT_FOUND).json({ error: `User with email ${req.params.email} does not exist`});
                }
            })
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `There are no mixtapes found.`});
        }

    })

}

module.exports.getMixtape = function (req, res) {
    Mixtape.findOne({"_id": req.params.id}).then(mixtape => {
        if (mixtape) {

            return res.json({mixtape: mixtape});
        } else {
            return res.status(httpStatus.BAD_REQUEST).json({ error: `Could not save mixtape.`});
        }
    })
}

module.exports.addTrack = function (req, res) {
    /*
    * validate track obj
    * append to branch obj
    * call update
    * */
    var mixtape = req.body.mixtape;
    if (mixtape == null) {
        return res.status(httpStatus.BAD_REQUEST).json({ email: `mixtape does not exist`});
    }
    let branch = mixtape.branch;
    let track = req.body.track;
    console.log('mixtape: ' + mixtape)
    console.log('branch: ' + branch)
    console.log('typeof track: ' + typeof track)

    branch.tracks.append(track);
    Mixtape.updateOne({"_id": mixtape._id}, {branch: branch}).then(mixtape => {
        if (mixtape){
            return res.json({mixtape: mixtape});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `There are no mixtapes found.`});
        }
    })
}
