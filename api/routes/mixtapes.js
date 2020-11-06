/**
 * Contains all api functions for mixtape related routes
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");

// load controllers
const controller = require("../controllers/mixtapes");
const { createMixtape, getMixtape } = controller;

router.post("/mixtape", passport.authenticate('jwt', {session: false}), createMixtape);
router.get('/mixtape/:id', passport.authenticate('jwt', {session: false}), getMixtape);

module.exports = router;
