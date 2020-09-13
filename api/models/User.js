const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mixtapeSchema = require("./Mixtape");

// Create Schema
const UserSchema = new Schema({
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

    mixtapes: {
        type: Array,
        default: []
    },


    // mixtapes: [{
    //     title: String,
    //     artist: [{type: String}],
        
    // }],
 
});

module.exports = User = mongoose.model("users", UserSchema);