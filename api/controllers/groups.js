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
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no users found with id ${req.body.user._id}`});
    }

    return res.status(httpStatus.OK).json({ newGroup });
}

async function getGroupHelper(id) {
    let group = await Group.findOne({"_id": id}).catch( (err) => {return null} );
    return group;
}

module.exports.getGroupByID = getGroupHelper;

module.exports.getGroup = async function (req, res) {
    let group = await getGroupHelper(req.params.id);

    if (group != null) {
        return res.status(httpStatus.OK).json({ Group: group });
    } else {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no groups found with id ${req.params.id}`});
    }
}

module.exports.userJoinsGroup = async function (req, res) {
    let update_query = { $push: { groups:
                {
                    _id: req.params.id,
                    name: req.body.group_name
                }
        }};
    let newUser = await User.findOneAndUpdate({"_id": req.body.user._id}, update_query, {new: true});
    if (newUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no users found with id ${req.body.user._id}`});
    }
    update_query = { $push: { members:
                {
                    _id: req.body.user._id,
                    name: req.body.user.username
                }
    }};

    let newGroup = await Group.findOneAndUpdate({"_id": req.params.id}, update_query,{new: true});
    if (newGroup == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no groups found with id ${req.params.id}`});
    }

    return res.status(httpStatus.OK).json({ Group: newGroup, User: newUser });
}

module.exports.userLeaveGroup = async function (req, res) {
    let update_query = { $pull: { groups:
                { _id: req.params.id }
        }};
    let newUser = await User.findOneAndUpdate({"_id": req.body.user_id}, update_query, {new: true});
    if (newUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no users found with id ${req.body.user_id}`});
    }
    update_query = { $pull: { members:
                { _id: req.body.user_id }
        }};

    let newGroup = await Group.findOneAndUpdate({"_id": req.params.id}, update_query,{new: true});
    if (newGroup == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no groups found with id ${req.params.id}`});
    }

    return res.status(httpStatus.OK).json({ Group: newGroup, User: newUser });
}

module.exports.addMixtape = async function (req, res) {
    let update_query = { $push: { mixtapes:
                {
                    _id: req.body.mixtape_id,
                    name: req.body.mixtape_name
                }
        }};

    let newGroup = await Group.findOneAndUpdate({"_id": req.params.id}, update_query,{new: true});
    if (newGroup == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `there are no groups found with id ${req.params.id}`});
    }

    return res.status(httpStatus.OK).json({ Group: newGroup });
}