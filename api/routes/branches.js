/**
 * Contains all api functions for branch related routes
 * createBranch
 */

const express = require("express");
const router = express.Router();

// load controllers
const controller = require("../controllers/branches");
const { createBranch, getBranch, deleteBranch, updateBranch, addTrack, removeTrack } = controller;

router.post("/branch", createBranch);
router.get('/branch/:id', getBranch);
router.delete('/branch/:id', deleteBranch);
router.patch('/branch/:id', updateBranch);
router.patch('/branch/:id/addtrack', addTrack);
router.patch('/branch/:id/removetrack/:track_id', removeTrack);

module.exports = router;
