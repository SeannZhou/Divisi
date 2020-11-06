const httpStatus = require('http-status');
const mongoose = require("mongoose");

// load models
const Mixtape = require("../models/Mixtape");

// load input validation
const validateMixtapeInput = require("../utils/mixtape");

module.exports.createMixtape = function (req, res) {
    const { errors, isValid } = validateMixtapeInput(req.body);    // Mixtape validation
    if (!isValid) return res.status(400).json(errors)

    const newMixtape = new Mixtape({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        branch: null,
        user_branches: null,
        mixtape_cover: "",
        description: "",
        num_of_songs: 0,
        total_duration: 0,
        is_public: req.body.is_public,
        created_by: req.body.created_by,
        share_link: "",
        who_likes: [],
        num_of_likes: 0,
    });
    newMixtape.save()
        .then(mixtape => res.json(mixtape))
        .catch(err => console.log(err));

    return res.status(httpStatus.CREATED);
}

module.exports.getMixtape = function (req, res) {
    Mixtape.findOne({"_id": req.params.id}).then(mixtape => {
        if (mixtape){
            return res.json({mixtape: mixtape});
        } else {
            return res.status(httpStatus.NOT_FOUND).json({ error: `There are no mixtapes found.`});
        }
    })
}

