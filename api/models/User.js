const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    _id: {
        type:  String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    branches: {
            type: Array,
            required: false
    },
    mixtapes: {
        type: Array,
        required: false
    },
    groups: {
        type: Array,
        required: false
    },
    friends: {
        type: Array,
        required: false
    },
    profile_picture: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    liked_tracks: {
        type: Array,
        required: false
    }
});

module.exports = User = mongoose.model("users", UserSchema);
