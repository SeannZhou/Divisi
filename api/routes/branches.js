/**
 * Contains all api functions for branch related routes
 * createBranch
 */

const express = require("express");
const router = express.Router();

// load controllers
const controller = require("../controllers/branches");
const { createBranch, getBranch, deleteBranch, updateBranch, addTrack, removeTrack } = controller;

router.post("/", createBranch);
router.get('/:id', getBranch);
router.delete('/:id', deleteBranch);
router.patch('/:id', updateBranch);
router.patch('/:id/addtrack', addTrack);
router.patch('/:id/removetrack/:track_id', removeTrack);

module.exports = router;
