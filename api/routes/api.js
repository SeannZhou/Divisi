/**
 * Contains all api functions for track related routes
 * getTrack
 * getArtist
 */

const express = require("express");
const router = express.Router();


// load controllers
const controller = require("../controllers/api");
const { getTrack, getArtist, getAlbum, search } = controller;

router.get('/track/:id', getTrack);
router.get('/artist/:id', getArtist);
router.get('/album/:id', getAlbum);
router.get('/search', search);

module.exports = router;

