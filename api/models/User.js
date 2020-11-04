const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({     // Still need to add mixtapes, groups, friends
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
    profile_picture: {              // gender, country, profile_picture false for now
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
    }
});

module.exports = User = mongoose.model("users", UserSchema);