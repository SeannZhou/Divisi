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
        user_id: { type: String },
        name: { type: String }
    },
    branched_from: {
        mixtape_id: { type: String },
        name: { type: String }
    },
    share_link: {
        type: String
    },
    tracks: {
        type: Array
    }
});

module.exports = Branch = mongoose.model("branches", BranchSchema);
