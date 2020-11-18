/**
 * Contains all api functions for branch related routes
 * createBranch
 */

const express = require("express");
const router = express.Router();
const passport = require("passport");

// load controllers
const controller = require("../controllers/branches");
const { createBranch, getBranch } = controller;

router.post("/branch", createBranch);
router.get('/branch/:id', getBranch);

module.exports = router;
