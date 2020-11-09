const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const GroupSchema = new Schema({
    _id: {
        type:  String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        required: true
    },
    owner: {
        user_id: { type: String },
        name: { type: String }
    },
    mixtapes: {
        type: Array,
        required: false
    },
    activity: {
        type: Array,
        required: false
    },
    is_public: {
        type: Boolean,
        required: true
    },
    share_link: {
        type: String,
        required: false
    },
    group_cover: {
        type: String,
        required: false
    },
    description: {
        required: false,
        type: String,
    },
    num_of_likes: {
        type: Number,
        required: false
    }
});

module.exports = Group = mongoose.model("groups", GroupSchema);