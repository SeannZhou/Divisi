const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};
    // convert empty fields to empty strings
    data.name = !isEmpty(data.name) ? data.name : "";
    // console.log("new user registering");
    // console.log(`data.name: ${data.name}`);
    // console.log(`data.email: ${data.email}`);
    // console.log(`data.password: ${data.password}`);
    // console.log('name type: ' + typeof(data.name));
    // console.log('email type: ' + typeof(data.email));
    // console.log('password type: ' + typeof(data.password));
    
    //Validations
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name Field is required";
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Confirm password field is required";
    }
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
