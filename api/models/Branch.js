const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BranchSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    share_link: {
        type: String,
        required: false
    },
    tracks: {
        type: Array,
        required: false
    }
});

module.exports = Branch = mongoose.model("branches", BranchSchema);
