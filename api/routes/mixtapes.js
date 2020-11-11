/**
 * Contains all api functions for mixtape related routes
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");

// load controllers
const controller = require("../controllers/mixtapes");
const { createMixtape, deleteMixtape, getMixtape, addTrack, removeTrack } = controller;

router.post("/mixtape", createMixtape);
router.delete('/mixtape/:id', deleteMixtape);
router.get('/mixtape/:id', getMixtape);
router.patch('/mixtape/:id/addtrack', addTrack);
router.patch('/mixtape/:id/removetrack', removeTrack);

module.exports = router;
