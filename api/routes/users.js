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

const controller = require("../controller/user");
const { registerUser, updateNameByEmail, getUser, getAllUser, deleteUser } = controller;

router.post("/register", registerUser);

router.put("/:email/:name", updateNameByEmail)

router.get('/:email', getUser)

router.get('', getAllUser)

router.delete("/:email", deleteUser)

module.exports = router;