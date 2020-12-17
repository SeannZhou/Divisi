const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const Activity = require("../models/Activity")


module.exports.createComment = async function (req, res) {
    let user = await User.findOne({"_id": req.body.comment.created_by.user_id});
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.body.comment.created_by.user_id} does not exist`});
    }
    let new_comment = {
        created_by: req.body.comment.created_by,
        profile_picture: user.profile_picture,
        content: req.body.comment.content,
        timestamp: new Date()
    };

    // Add new comment to activity
    let activity = await Activity.findOneAndUpdate({ _id: req.params.id }, {
        $push: { comments: { new_comment } }
    }, { new: true });
    if (activity == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `activity with id ${req.params.id} does not exist` });
    }

    // Update inside target obj

    return res.status(httpStatus.OK).json({ activity: activity });
}
