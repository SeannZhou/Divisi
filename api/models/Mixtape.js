const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const MixtapeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: [String],
        required: true
    },

    language: {
        type: [String],
        required: true
    }
})

module.exports = Mixtape = mongoose.model("mixtapes", MixtapeSchema)