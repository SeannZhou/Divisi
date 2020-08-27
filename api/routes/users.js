/**
 * Contains all api functions for user related routes
 * register
 * login
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const httpStatus = require('http-status');

// Load input validation
const validateRegisterInput = require("../utils/register");

//load models
const User = require("../models/User");


router.post("/register", (req, res) => {
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
});

router.get('/:email', (req, res) => {
    User.findOne({email: req.params.email}).then(user => {
        // console.log(user);
        if (user){
            return res.json({user: user});
        } else {
            // console.log(httpStatus.NOT_FOUND);
            return res.status(httpStatus.NOT_FOUND).json({ error: `User with email ${req.params.email} does not exist`});
        }
    })
})

router.delete("/:email", (req, res) => {
    User.findOneAndDelete({ email: req.params.email }).then(user => {
        if (user) {
            return res.json({ user: user });
        }else {
            return res.status(400).json({ email: `user with email ${req.param.email} does not exist`});
        }
    })
})

module.exports = router;