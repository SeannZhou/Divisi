const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const User = require("../models/User");
const Group = require("../models/Group");
const Activity = require("../models/Activity");

module.exports.createGroup = async function (req, res) {
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
        num_of_likes: 0
    });

    let retval = await newGroup.save();
    if (retval == null){
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `group could not be saved.`});
    }

    let updatedUser = await User.findOneAndUpdate({"_id": req.body.user._id}, {
        $push: {groups: { _id: newGroup._id, name: newGroup.name }}
    }, {new: true} );
    if (updatedUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.body.user._id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ group: newGroup, user: updatedUser });
}

async function getGroupHelper(id) {
    let group = await Group.findOne({"_id": id}).catch( (err) => {return null} );
    return group;
}

module.exports.getGroupByID = getGroupHelper;

module.exports.getGroup = async function (req, res) {
    let group = await getGroupHelper(req.params.id);

    if (group != null) {
        return res.status(httpStatus.OK).json({ group: group });
    } else {
        return res.status(httpStatus.NOT_FOUND).json({ error: `group with id ${req.params.id} does not exist`});
    }
}

const updateGroupActivity = async(activity, group) => {
    update_query = {
        $push: {
            activities: activity
        }
    };
    return await Group.findOneAndUpdate({"_id": group._id}, update_query, { new: true });
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
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.body.user._id} does not exist`});
    }
    update_query = {
        $push: {
            members: {
                _id: req.body.user._id,
                name: req.body.user.username
            }
        }
    };
    let newGroup = await Group.findOneAndUpdate({"_id": req.params.id}, update_query, {new: true} );
    if (newGroup == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `group with id ${req.params.id} does not exist`});
    }
     // create activity
     let newActivity = new Activity({
        _id: mongoose.Types.ObjectId(),
        type: "NewGroupMember",
        user: {
            _id: newUser._id,
            username: newUser.username,
            profile_picture: newUser.profile_picture
        },
        target: {
            _id: newGroup._id,
            name: newGroup.name
        },
        num_of_likes: 0,
        group: newGroup._id,
        timestamp: new Date()
    });
    await newActivity.save();
    newGroup = await updateGroupActivity(newActivity, newGroup);

    return res.status(httpStatus.OK).json({ group: newGroup, user: newUser, activity: newActivity });
}

module.exports.userLeaveGroup = async function (req, res) {
    // check required fields are in the payload
    let update_query = { $pull: { groups:
                { _id: req.params.id }
        }};
    let newUser = await User.findOneAndUpdate({"_id": req.body.user_id}, update_query, {new: true} );
    if (newUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.body.user_id} does not exist`});
    }
    update_query = { $pull: { members:
                { _id: req.body.user_id }
        }};

    let newGroup = await Group.findOneAndUpdate({"_id": req.params.id}, update_query,{new: true});
    if (newGroup == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `group with id ${req.params.id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ group: newGroup, user: newUser });
}

module.exports.addMixtape = async function (req, res) {
    let group = await Group.findOne({ _id: req.params.id });
    if (group == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `group with id ${req.params.id} does not exist`});
    }
    else {
        for (let i = 0; i < group.mixtapes.length; i++) {
            if (group.mixtapes[i]._id === req.body.mixtape_id) {
                return res.status(httpStatus.BAD_REQUEST).json({ error: `mixtape with id ${req.body.mixtape_id} already exists`});
            }
        }
    }
    let update_query = { $push: { mixtapes:
                {
                    _id: req.body.mixtape_id,
                    name: req.body.mixtape_name
                }
        }};

    let newGroup = await Group.findOneAndUpdate({"_id": req.params.id}, update_query, {new: true});
    if (newGroup == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `group with id ${req.params.id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ group: newGroup });
}

module.exports.removeMixtape = async function (req, res) {
    let update_query = { $pull: { mixtapes:
                {
                    _id: req.params.mixtape_id
                }
        }};

    let newGroup = await Group.findOneAndUpdate({"_id": req.params.group_id}, update_query, {new: true});
    if (newGroup == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `group with id ${req.params.group_id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ group: newGroup });
}

module.exports.updateGroup = async function (req, res) {
    let updatedGroup = await Group.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });
    if (updatedGroup == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `group with id ${req.params.id} does not exist`});
    }

    let updatedUser = null;
    // Check if need to update name in user obj
    if (req.body.name) {
        updatedUser = await User.findOneAndUpdate({ _id: updatedGroup.created_by.user_id, "groups._id": req.params.id },
        { "$set": {
            "groups.$.name": req.body.name
        } }, {new: true} );
    } else {
        updatedUser = await User.findOne({ _id: updatedMixtape.created_by.user_id });
    }

    if (updatedUser == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${updatedMixtape.created_by.user_id} does not exist`});
    }

    return res.status(httpStatus.OK).json({ group: updatedGroup, user: updatedUser });
}

module.exports.deleteGroup = async function (req, res) {
    // Invalid requests handled
    let group = await getGroupHelper(req.params.group_id);
    if (group == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `group with id ${req.params.group_id} does not exist`});
    }
    if (group.created_by.user_id != req.params.user_id) {
        return res.status(httpStatus.FORBIDDEN).json({ error: `user with id ${req.params.user_id} is forbidden access`});
    }
    let user = await User.findOne( { _id: req.params.user_id } );
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.params.user_id} does not exist`});
    }

    // Deleting group and removing group from user groups
    let deleteGroup = await Group.findOneAndDelete({ "_id": req.params.group_id });
    if (deleteGroup == null) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `group could not be deleted.`});
    }

    group.members.push(req.params.user_id);     // Add owner to members
    let groupMembers = group.members;
    let removeUserGroups = await User.update(
        { _id: { $in: groupMembers } },
        { $pull: { groups: { _id: group._id } } },
        { multi: true }
    );
    if (removeUserGroups == null) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: `Updating group members failed.`});
    }

    user = await User.findOne( { _id: req.params.user_id } );
    if (user == null) {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.params.user_id} does not exist`});
    }


    return res.status(httpStatus.OK).json({ user: user });
}
