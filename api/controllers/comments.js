const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const Activity = require("../models/Activity")


module.exports.createComment = async function (req, res) {
    // Add new comment to activity
    let activity = await Activity.findOneAndUpdate({ _id: req.params.id }, {
        $push: { comments: { req.body.comment } }
    }, { new: true });
    if (activity == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `activity with id ${req.params.id} does not exist` });
    }

    return res.status(httpStatus.OK).json({ activity: activity });
}
