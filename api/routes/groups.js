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
const { createGroup, getGroup, getGroups, userJoinsGroup, userLeaveGroup, addMixtape, removeMixtape, updateGroup, deleteGroup } = controller;

router.post("/", createGroup);
router.get('/:id', getGroup);
router.get('/all/groups', getGroups);
router.patch("/:id/join", userJoinsGroup);
router.patch("/:id/leave", userLeaveGroup);
router.patch("/:id/addMixtape", addMixtape);
router.patch("/:group_id/removeMixtape/:mixtape_id", removeMixtape);
router.patch("/:id", updateGroup);
router.delete("/:group_id/user/:user_id", deleteGroup);

module.exports = router;
