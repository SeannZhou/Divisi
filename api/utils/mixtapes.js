const mongoose = require("mongoose");
const Validator = require("validator");
const isEmpty = require("is-empty");

Branch = require("../models/Branch");


module.exports = function validateMixtapeInput (data) {
    let errors = {};

// Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";

// Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
// is_public checks
    if (!Validator.isBoolean(data.is_public)) {
        errors.privacy = "Privacy field is invalid";
    }
// created_by checks
    if (Validator.isEmpty(data.user._id)) {
        errors.user_id = "user ID field is empty";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
