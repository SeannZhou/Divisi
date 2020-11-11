const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const User = require("../models/User");
const Group = require("../models/Group");

// load controllers
// const { getUserById } = require("../controllers/users");

// load input validation
const { validateMixtapeInput, validateTrackInput } = require("../utils/mixtapes");


module.exports.createGroup = async function (req, res) {
    // const { errors, isValid } = validateMixtapeInput(req.body);    // Group validation
    // if (!isValid) return res.status(httpStatus.BAD_REQUEST).json(errors)


    // Creat group and add branch obj inside
    const newGroup = new Group({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        members: [],
        mixtapes: [],
        activity: [],
        group_cover: req.body.group_cover,
        description: req.body.description,
        is_public: req.body.is_public,
        created_by: {
            user_id: req.body.user._id,
            name: req.body.user.username
        },
        share_link: "",
        num_of_likes: 0,
    });

    let retval = await newGroup.save();
    if (retval == null){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `Group could not be saved.`});
    }

    let updatedUser = await User.updateOne({"_id": req.body.user._id}, {
        $push: {groups: { _id: newGroup._id, name: newGroup.name }}
    });
    if (updatedUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `There are no user found.`});
    }

    return res.json(newGroup);
}
