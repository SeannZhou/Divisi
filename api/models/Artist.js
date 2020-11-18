const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ArtistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    albums: {
        type: Array,
        required: false
    },
    likes: {
        type: Array,
        required: false
    },
    total_likes: {
        type: Number,
        required: false
    }
});

module.exports = Artist = mongoose.model("artists", ArtistSchema);