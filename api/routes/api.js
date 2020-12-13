/**
 * Contains all api functions for track related routes
 * getTrack
 * getArtist
 */

const express = require("express");
const router = express.Router();


// load controllers
const controller = require("../controllers/api");
const { getTrack, getArtist, getAlbum, getActivity, search, likeTrack, unlikeTrack } = controller;

router.get('/track/:id', getTrack);
router.patch('/track/:user_id/like/', likeTrack);
router.patch('/track/:user_id/unlike/', unlikeTrack);
router.get('/artist/:id', getArtist);
router.get('/album/:id', getAlbum);
router.get('/activity/:id', getActivity);
router.get('/search', search);

module.exports = router;

