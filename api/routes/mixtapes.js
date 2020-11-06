/**
 * Contains all api functions for mixtape related routes
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");

// load controllers
const controller = require("../controllers/mixtapes");
const { createMixtape, getMixtape, addTrack, removeTrack } = controller;

router.post("/mixtape", createMixtape);
router.get('/mixtape/:id', passport.authenticate('jwt', {session: false}), getMixtape);
router.patch('/mixtape/:id/addtrack', passport.authenticate('jwt', {session: false}), addTrack);
router.patch('/mixtape/:id/removetrack', passport.authenticate('jwt', {session: false}), removeTrack);

module.exports = router;
