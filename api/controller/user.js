/**
 * Contains all api functions for user related routes
 * register
 * login
 * updateNameByEmail
 * getUser
 * getAllUser
 * delete
 */


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require('http-status');

//load models
const User = require("../models/User");

// Load input validation
const validateRegisterInput = require("../utils/register");

module.exports.registerUser = function (req, res) {
    const { errors, isValid } = validateRegisterInput(req.body);    // Form validation
    if (!isValid) return res.status(400).json(errors)

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
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

module.exports.updateNameByEmail = function (req, res) {
    let newName = req.params.name;
    if (newName) {
        User.updateOne({email: req.params.email}, {name: newName}).then(promise => {
            if (promise.n == 1) {
                return res.json({usobjecter: promise});
            } else {
                return res.status(httpStatus.NOT_FOUND).json({ error: `User with email ${req.params.email} does not exist`});
            }
        })
    }
}

module.exports.getUser = function (req, res) {
    User.findOne({email: req.params.email}).then(user => {
        if (user){
            return res.json({user: user});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `There are no users found.`});
        }
    })
}

module.exports.getAllUsers = function (req, res) {
    User.find().then(user => {
        if (user){
            return res.json({user: user});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `User with email ${req.params.email} does not exist`});
        }
    })
}

module.exports.deleteUser = function (req, res) {
    User.findOneAndDelete({ email: req.params.email }).then(user => {
        if (user) {
            return res.json({ user: user });
        }else {
            return res.status(400).json({ email: `user with email ${req.param.email} does not exist`});
        }
    })
}