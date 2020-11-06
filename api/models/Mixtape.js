const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MixtapeSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    branch: {
        type: Schema.Types.ObjectId,
        required: false
    },
    user_branches: [{
        user_ids: Array,
        branch_ids: Array,
    }],
    mixtape_cover: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    num_of_songs: {
        type: Number,
        required: false
    },
    total_duration: {
        type: Number,
        required: false
    },
    is_public: {
        type: Boolean,
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
    who_likes: {
        type: Array,
        required: false
    },
    num_of_likes: {
        type: Number,
        required: false
    }
});

module.exports = Mixtape = mongoose.model("mixtapes", MixtapeSchema);
