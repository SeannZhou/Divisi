const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateMixtapeInput(data) {
    let errors = {};
// Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.created_by = !isEmpty(data.created_by) ? data.created_by : "";

// Name checks
    if (Validator.isEmpty(data.name)) {
        errors.email = "Name field is required";
    }
// created_by checks
    if (Validator.isEmpty(data.created_by)) {
        errors.created_by = "user ID field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};
