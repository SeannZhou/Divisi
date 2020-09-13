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
const validateEditInput = require("../utils/register");
// const validateLoginInput = require("../../validation/login");

//load models
const User = require("../models/User");
const Mixtape = require("../models/Mixtape");


router.post("/register", (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);    // Form validation
    if (!isValid) return res.status(400).json(errors)

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            // const mixtape = new Mixtape({
            //     name: "Testing"
            // })


            // const mixtape = new Mixtape({
            //     title: "Song",
            //     artist: ["hello", "world"],
            //     language: "English",
            // })

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                mixtapes: req.body.mixtapes,
                
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

router.put("/:email/:name", (req, res) => {
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
})

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


router.post("/edit", (req,res) => {
    User.findOne({email: "jennyxu1029@gmail.com"}).then(user => {
        console.log(req.body.name);
        user.name = req.body.name;
        user.save();
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