const mongoose = require("mongoose");
const Validator = require("validator");
const isEmpty = require("is-empty");

Branch = require("../models/Branch");


module.exports.validateMixtapeInput = function (data) {
    let errors = {};

// Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.description = !isEmpty(data.description) ? data.description : "";
    data.user._id = !isEmpty(data.user._id) ? data.user._id : "";
    data.user.username = !isEmpty(data.user.username) ? data.user.username : "";

// Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
// is_public checks
    if (!Validator.isBoolean(data.is_public)) {
        errors.privacy = "Privacy field is invalid";
    }
// user id checks
    if (Validator.isEmpty(data.user._id)) {
        errors.user_id = "user ID field is empty";
    }
// user name checks
    if (Validator.isEmpty(data.user.username)) {
        errors.name = "Name field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports.validateTrackInput = function (data) {
    let errors = {};

// Convert empty fields to an empty string so we can use validator functions
    data.artist_name = !isEmpty(data.artist_name) ? data.artist_name : "";
    data.title = !isEmpty(data.title) ? data.title : "";
    data.cover_picture = !isEmpty(data.cover_picture) ? data.cover_picture : "";
    data.api_url = !isEmpty(data.api_url) ? data.api_url : "";
    data._id = !isEmpty(data._id) ? data._id : "";


// Artist checks
    if (Validator.isEmpty(data.artist_name)) {
        errors.artist_name = "Artist name field is required";
    }
// title checks
    if (Validator.isEmpty(data.title)) {
        errors.title = "Title field is empty";
    }
// cover_picture checks
    if (Validator.isEmpty(data.cover_picture)) {
        errors.cover_picture = "Cover_picture field is empty";
    }
// api_url checks
    if (Validator.isEmpty(data.api_url)) {
        errors.api_url = "Api_url field is empty";
    }
// _id checks
    if (Validator.isEmpty(data._id)) {
        errors._id = "_id field is empty";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};