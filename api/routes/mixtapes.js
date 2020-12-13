/**
 * Contains all api functions for mixtape related routes
 * createMixtape
 * deleteMixtape
 * getMixtape
 * addTrack
 * removeTrack
 */

const express = require("express");
const router = express.Router();

// load controllers
const controller = require("../controllers/mixtapes");
const { createMixtape, deleteMixtape, getMixtape, addTrack, removeTrack, updateMixtape } = controller;

router.post("/", createMixtape);
router.delete('/:mixtape_id/delete/:user_id', deleteMixtape);
router.get('/:id', getMixtape);
router.patch('/:id/addtrack', addTrack);
router.patch('/:id/removetrack', removeTrack);
router.patch("/:id", updateMixtape);

module.exports = router;
