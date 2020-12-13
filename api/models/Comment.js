const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CommentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    created_by: {
        type: Object,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_timestamp: {
        type: Date,
        required: true
    }
});

module.exports = Comment = mongoose.model("comment", CommentSchema);