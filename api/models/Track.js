const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TrackSchema = new Schema({
    _id:{
        type: String
    },
    album: {
        type: Object
    },
    name: {
        type: String,
        required: true
    },
    artists: {
        type: Array
    },
    uri: {
        type: String
    },
    duration_ms: {
        type: Number,
    }
});

module.exports = Track = mongoose.model("tracks", TrackSchema);
