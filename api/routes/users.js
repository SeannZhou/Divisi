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
router.put("/:id/:name", updateNameByEmail);
router.get('/account/:id', getUser);
router.delete("/account/:id", deleteUser);
router.patch("/account/:id", updateUser);
 
module.exports = router;
 
 