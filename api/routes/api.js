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
router.patch('/track/:track_id/like/:user_id', likeTrack);
router.patch('/track/:track_id/unlike/:user_id', unlikeTrack);
router.get('/artist/:id', getArtist);
router.get('/album/:id', getAlbum);
router.get('/search', search);

module.exports = router;

