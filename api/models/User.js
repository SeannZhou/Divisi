const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    _id: {
        type:  String,
        required: true
    },
    name: {
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
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }

});

module.exports = User = mongoose.model("users", UserSchema);