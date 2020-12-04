const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const User = require("../models/User");

// load input validation
const validateRegisterInput = require("../utils/register");
const validateLoginInput = require("../utils/login");

module.exports.registerUser = function (req, res) {
    const { errors, isValid } = validateRegisterInput(req.body);    // Form validation
    if (!isValid) return res.status(httpStatus.BAD_REQUEST).json(errors)

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(httpStatus.BAD_REQUEST).json(`User with email ${req.body.email} already exist`);
        } else {
            const newUser = new User({
                _id: mongoose.Types.ObjectId(),
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profile_picture: "",
                description: "",
                mixtapes: [],
                branches: [],
                groups: [],
                friends: [],
                gender: "",
                country: "",
                age: "",
                liked_tracks: []
            });
            console.log(newUser)
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
            return res.status(httpStatus.CREATED);
        }
    });
}
module.exports.loginUser = function (req, res) {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    console.log(errors, isValid);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ error: `user with email ${email} does not exist`});
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                    const payload = {
                        _id: user.id,
                        username: user.username,
                        email: user.email,
                        mixtapes: user.mixtapes,
                        branches: user.branches,
                        gender: user.gender,
                        age: user.age,
                        groups: user.groups,
                        friends: user.friends,
                        liked_tracks: user.liked_tracks
                    };
                // Sign token
                jwt.sign(
                    payload,
                    'secret',
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            user: user,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json({ error: "Password incorrect" });
            }
        });
    });
}

async function getUserHelper(id) {
    let user = await User.findOne({"_id": id}).catch( (err) => {return null} );
    return user;
}

module.exports.getUserById = getUserHelper;

module.exports.getUser = async function (req, res) {
    let user = await getUserHelper(req.params.id);

    if (user != null) {
        return res.status(httpStatus.OK).json({ user: user });
    } else {
        return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.params.id} does not exist`});
    }
}

module.exports.deleteUser = function (req, res) {
    User.findOneAndDelete({ "_id": req.params.id }).then(user => {
        if (user) {
            return res.status(httpStatus.OK).json({ user: user });
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.params.id} does not exist`});
        }
    })
}

module.exports.updateUser = function (req, res) {
    User.findOneAndUpdate({"_id": req.params.id}, {$set: req.body}, {new: true}).then(user => {
        if (user) {
            return res.status(httpStatus.OK).json({ user: user });
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `user with id ${req.params.id} does not exist`});
        }
    })
}

module.exports.addFriend = async (req, res) => {
    if(req.params.id == req.body.user._id){
        return res.status(httpStatus.BAD_REQUEST).json({ error: "You cannot friend yourself"});
    }
    let friend = await getUserHelper(req.params.id);
    let user = req.body.user;
    if(user.friends.some(e => e._id === user._id) || friend.friends.some(e => e._id === user._id)){
        return res.status(httpStatus.BAD_REQUEST).json({ error: `User ${friend.username} is already a friend of user ${user.username}`})
    }
    await User.updateOne({"_id": friend._id}, { $push: {friends: { _id: user._id, name: user.username }}});
    User.findOneAndUpdate({"_id": user._id}, {$push: {friends: { _id: friend._id, name: friend.username }}}, {new: true}).then(updatedUser => {
        return res.status(httpStatus.OK).json({user: updatedUser});
    })
}
