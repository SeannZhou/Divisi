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
        tracks: []
    });

    let retval = await newBranch.save();
    if (retval == null){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `Branch could not be saved.`});
    }

    let updatedMixtape = await Mixtape.updateOne({"_id": req.body.branched_from.mixtape_id}, {
        $push: {user_branches:
                {
                    branch_id: newBranch._id,
                    branch_name: newBranch.name,
                    created_by: {
                        user_id: newBranch.created_by.user_id,
                        name: newBranch.created_by.name
                    }
                }}
    });
    if (updatedMixtape == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `mixtape with id ${req.body.mixtape_id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ branch: newBranch });
}

async function getBranchHelper(id) {
    let branch = await Branch.findOne({"_id": id}).catch( (err) => {return null} );
    return branch;
}

module.exports.getBranch = async function (req, res) {
    let branch = await getBranchHelper(req.params.id);

    if (branch != null) {
        return res.status(httpStatus.OK).json({ branch: branch });
    } else {
        return res.status(httpStatus.NOT_FOUND).json({ error: `branch with id ${req.params.id} does not exist`});
    }
}

module.exports.addTrack = async function (req, res) {
    // Get branch
    let branch = await getBranchHelper(req.params.id);
    if (branch == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no Branches found.`});
    }

    let newBranch = await Branch.findOneAndUpdate({"_id": req.params.id}, {$push: {"tracks": req.body.track } }, {new: true});
    if (newBranch == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `branch with id ${req.params.id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ branch: newBranch });
}
