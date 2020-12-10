const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LikeSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    object_type: {
        type: String,
        required: true
    },
    object_id: {
        type: String,
        required: true
    },
    who_likes: {
        type: Array
    },
    num_of_likes: {
        type: Number
    }
});

module.exports = Like = mongoose.model("likes", LikeSchema);
