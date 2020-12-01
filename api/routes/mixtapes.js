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

router.post("/mixtape", createMixtape);
router.delete('/mixtape/:mixtape_id/delete/:user_id', deleteMixtape);
router.get('/mixtape/:id', getMixtape);
router.patch('/mixtape/:id/addtrack', addTrack);
router.patch('/mixtape/:id/removetrack', removeTrack);
router.patch("/mixtape/:id", updateMixtape);

module.exports = router;
