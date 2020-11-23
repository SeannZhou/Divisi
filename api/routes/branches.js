/**
 * Contains all api functions for branch related routes
 * createBranch
 */

const express = require("express");
const router = express.Router();

// load controllers
const controller = require("../controllers/branches");
const { createBranch, getBranch, addTrack } = controller;

router.post("/branch", createBranch);
router.get('/branch/:id', getBranch);
router.patch('/branch/:id/addtrack', addTrack);

module.exports = router;
