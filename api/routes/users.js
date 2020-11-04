/**
 * Contains all api functions for user related routes
 * register
 * login
 */
 
const express = require("express");
const router = express.Router();
const passport = require("passport");
 
 
// load controllers
const controller = require("../controllers/users");
const { registerUser, loginUser, updateNameByEmail, getUser, deleteUser } = controller;

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/secure", passport.authenticate('jwt', {session: false}), (req, res, next) => {
    console.log("user is logged in!");
    res.status(200).json({ success: true, msg: "You are authorized"});
});
router.put("/:email/:name", updateNameByEmail);
router.get('/user/:email', getUser);
router.delete("/:email", deleteUser);
 
module.exports = router;
 
 