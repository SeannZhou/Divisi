/**
 * Contains all api functions for user related routes
 * register
 * login
 */
 
const express = require("express");
const router = express.Router();
 
 
// load controllers
const controller = require("../controllers/users");
const { registerUser, loginUser, updateNameByEmail, getUser, deleteUser, updateUser } = controller;
 
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:email/:name", updateNameByEmail);
router.get('/account/:email', getUser);
router.delete("/account/:email", deleteUser);
router.patch("/account/:email", updateUser);
 
module.exports = router;
 
 