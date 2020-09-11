/**
 * Contains all request endpoint routes
 */

const express = require("express");
const router = express.Router();

const controller = require("../controller/user");
const { registerUser, updateNameByEmail, getUser, getAllUsers, deleteUser } = controller;

router.post("/register", registerUser);

router.put("/:email/:name", updateNameByEmail)

router.get('/:email', getUser)

router.get('users', getAllUsers)

router.delete("/:email", deleteUser)

module.exports = router;