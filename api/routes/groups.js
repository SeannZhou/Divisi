/**
 * Contains all api functions for group related routes
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");

// load controllers
const controller = require("../controllers/groups");
const { createGroup } = controller;

router.post("/group", createGroup);

module.exports = router;
