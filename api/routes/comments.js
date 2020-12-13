/**
 * Contains all api functions for comment related routes
 * createComment
 */

const express = require("express");
const router = express.Router();

// load controllers
const controller = require("../controllers/comments");
const { createComment } = controller;

router.post("/comment/:id", createComment);


module.exports = router;
