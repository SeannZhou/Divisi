const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    _id: {
        type:  String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    user: {
        type: Object,
        required: false
    },
    target: {
        type: Object,
        required: false
    },
    num_of_likes: {
        type: Number,
        required: false
    },
    group: {
        type: String,
        required: false
    },
    comments: {
        type: Array,
        required: false
    },
    timestamp: {
        type: Date,
        required: true
    }
});

module.exports = Activity = mongoose.model("activities", ActivitySchema);
