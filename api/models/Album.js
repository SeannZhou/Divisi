const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AlbumSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist_name: {
        type: String,
        required: true
    },
    artist_id: {
        type: String,
        required: true
    },
    release_date: {
        type: Date,
        required: true
    },
    num_of_likes: {
        type: Number,
        required: true
    },
    tracks: {
        type: Array,
        required: true
    }
});

module.exports = Album = mongoose.model("album", AlbumSchema);