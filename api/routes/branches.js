/**
 * Contains all api functions for branch related routes
 * createBranch
 */

const express = require("express");
const router = express.Router();

// load controllers
const controller = require("../controllers/branches");
const { createBranch, getBranch, addTrack, removeTrack } = controller;

router.post("/branch", createBranch);
router.get('/branch/:id', getBranch);
router.patch('/branch/:id/addtrack', addTrack);
router.patch('/branch/:branch_id/removetrack/:track_id', removeTrack);

module.exports = router;
