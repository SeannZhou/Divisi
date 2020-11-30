/**
 * Contains all api functions for group related routes
 * createGroup
 * getGroup
 * userJoinsGroup
 * userLeaveGroup
 * addMixtape
 */

const express = require("express");
const router = express.Router();

// load controllers
const controller = require("../controllers/groups");
const { createGroup, getGroup, userJoinsGroup, userLeaveGroup, addMixtape, removeMixtape, updateGroup } = controller;

router.post("/group", createGroup);
router.get('/group/:id', getGroup);
router.patch("/group/:id/join", userJoinsGroup);
router.patch("/group/:id/leave", userLeaveGroup);
router.patch("/group/:id/addMixtape", addMixtape);
router.patch("/group/:group_id/removeMixtape/:mixtape_id", removeMixtape);
router.patch("/group/:id", updateGroup);

module.exports = router;
