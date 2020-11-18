const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const Branch = require("../models/Branch");
const Mixtape = require("../models/Mixtape");


module.exports.createBranch = async function (req, res) {
    // Creat group and add branch obj inside
    const newBranch = new Branch({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        created_by: {
            user_id: req.body.created_by.user_id,
            name: req.body.created_by.name
        },
        share_link: "",
        tracks: []
    });

    let retval = await newBranch.save();
    if (retval == null){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `Branch could not be saved.`});
    }

    let updatedMixtape = await Mixtape.updateOne({"_id": req.body.mixtape_id}, {
        $push: {user_branches: { branch_id: newBranch._id, branch_name: newBranch.name }}
    });
    if (updatedMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no mixtapes found with id ${req.body.mixtape_id}`});
    }

    return res.status(httpStatus.OK).json({ newBranch });
}

module.exports.getBranch = function (req, res) {
    Branch.findOne({_id: req.params.id}).then(branch => {
        if (branch){
            return res.status(httpStatus.OK).json({user: branch});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `There are no users found.`});
        }
    })
}

