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
const { registerUser, loginUser, getUser, deleteUser, updateUser, addFriend, removeFriend } = controller;

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/:id', getUser);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);
router.patch("/:id/addFriend", addFriend);
router.patch("/:id/removeFriend", removeFriend);

module.exports = router;

