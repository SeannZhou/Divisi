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
    artist_cover: {
        type: String,
        required: false
    },
    who_likes: {
        type: Array,
        required: false
    },
    num_of_likes: {
        type: Number,
        required: false
    }
});

module.exports = Artist = mongoose.model("artists", ArtistSchema);