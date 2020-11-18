/**
 * Contains all api functions for track related routes
 * getTrack
 * getArtist
 */

const express = require("express");
const router = express.Router();


// load controllers
const controller = require("../controllers/api");
const { getTrack, getArtist } = controller;

router.get('/track/:id', getTrack);
router.get('/artist/:id', getArtist);

module.exports = router;

