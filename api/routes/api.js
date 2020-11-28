/**
 * Contains all api functions for track related routes
 * getTrack
 * getArtist
 */

const express = require("express");
const router = express.Router();


// load controllers
const controller = require("../controllers/api");
const { getTrack, getArtist, getAlbum, search, likeTrack, unlikeTrack } = controller;

router.get('/track/:id', getTrack);
router.patch('/track/:id/like', likeTrack);
router.patch('/track/:id/unlike', unlikeTrack);
router.get('/artist/:id', getArtist);
router.get('/album/:id', getAlbum);
router.get('/search', search);

module.exports = router;

