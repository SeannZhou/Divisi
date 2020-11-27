/**
 * Contains all api functions for user related routes
 * register
 * login
 * getUser
 * deleteUser
 * updateUser
 */

const express = require("express");
const router = express.Router();


// load controllers
const controller = require("../controllers/users");
const { registerUser, loginUser, getUser, deleteUser, updateUser, addFriend } = controller;

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/account/:id', getUser);
router.delete("/account/:id", deleteUser);
router.patch("/account/:id", updateUser);
router.patch("/user/:id/addFriend", addFriend);

module.exports = router;

