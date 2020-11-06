const mongoose = require("mongoose");
const Validator = require("validator");
const isEmpty = require("is-empty");

Branch = require("../models/Branch");


module.exports = function validateMixtapeInput(data) {
    let errors = {};
    console.log('HELLLOOoo')
    console.log(data.created_by);
// Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.is_public = !isEmpty(data.is_public) ? data.is_public : "";
    data.created_by = !isEmpty(data.created_by) ? data.created_by : "";
// Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
// is_public checks
    if (!Validator.isBoolean(data.is_public)) {
        errors.privacy = "Privacy field is invalid";
    }
// created_by checks
    if (Validator.isEmpty(data.created_by)) {
        errors.created_by = "user ID field is invalid";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = function createBranch(name, creator) {
    let newBranch = new Branch({
        _id: mongoose.Types.ObjectId(),
        name: name,
        created_by: creator,
        share_link: "",
        tracks: []
    });

    newBranch.save()
        .then(newBranch => {
            return newBranch;
        })
        .catch(err => console.log(err));
}
