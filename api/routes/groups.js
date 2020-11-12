/**
 * Contains all api functions for group related routes
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");

// load controllers
const controller = require("../controllers/groups");
const { createGroup, getGroup, userJoinsGroup } = controller;

router.post("/group", createGroup);
router.get('/group/:id', getGroup);
router.patch("/group/:groupId/join/:userId", userJoinsGroup);

module.exports = router;
