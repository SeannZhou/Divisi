/**
 * Contains all api functions for track related routes
 * getTrack
 */

const express = require("express");
const router = express.Router();


// load controllers
const controller = require("../controllers/api");
const { getTrack } = controller;

router.get('/track/:id', getTrack);

module.exports = router;

