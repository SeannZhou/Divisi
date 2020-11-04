const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TrackSchema = new Schema({
    artist_name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    album: {
        type: String
    },
    api_url: {
        type: String,
        required: true
    },
    cover_picture: {
        type: String,
        required: true
    },
    num_of_likes: {
        type: Number
    }
});

module.exports = Track = mongoose.model("tracks", TrackSchema);
